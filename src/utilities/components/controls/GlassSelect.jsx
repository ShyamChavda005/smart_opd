// ============================================================
//  GlassSelect.jsx – Shared glassmorphic dropdown (UI-only)
//  Drop-in replacement for native <select>:
//    <GlassSelect value onChange name required disabled
//      placeholder label icon variant="bare" options>
//      <option … />
//    </GlassSelect>
//  Emits onChange({ target: { name, value } }) – same shape as
//  native selects. options prop accepts [{value,label,disabled}]
//  or plain strings. Uncontrolled when `value` is undefined.
// ============================================================

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

function childText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childText).join('');
  if (React.isValidElement(node) && node.props) return childText(node.props.children);
  return '';
}

function normalizeOptions(children, optionsProp) {
  if (optionsProp && optionsProp.length) {
    return optionsProp.map((o, i) => {
      if (o && typeof o === 'object' && ('value' in o || 'label' in o)) {
        return {
          value: String(o.value ?? ''),
          label: o.label ?? String(o.value ?? ''),
          disabled: !!o.disabled,
          key: o.key ?? i,
        };
      }
      return { value: String(o), label: String(o), disabled: false, key: i };
    });
  }
  const list = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === 'option') {
      const v =
        child.props.value !== undefined && child.props.value !== null
          ? String(child.props.value)
          : childText(child.props.children);
      list.push({
        value: v,
        label: child.props.children,
        disabled: !!child.props.disabled,
        key: child.key ?? list.length,
      });
    }
  });
  return list;
}

export default function GlassSelect({
  value,
  defaultValue,
  onChange,
  name,
  required,
  disabled,
  placeholder,
  label,
  icon,
  variant,
  options,
  children,
  className,
  style,
  ariaLabel,
  inline,
}) {
  const opts = useMemo(() => normalizeOptions(children, options), [children, options]);
  const isControlled = value !== undefined;
  const firstValue = opts.length ? opts[0].value : '';
  const [inner, setInner] = useState(
    defaultValue !== undefined ? String(defaultValue) : placeholder ? '' : firstValue
  );
  const displayValue = isControlled ? String(value ?? '') : inner;

  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 200, up: false });
  const [activeIdx, setActiveIdx] = useState(-1);
  const [typeBuf, setTypeBuf] = useState('');
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const typeTimer = useRef(null);

  const selected = opts.find((o) => o.value === displayValue);
  const hasMatch = !!selected;
  const shownLabel = hasMatch ? selected.label : placeholder ? placeholder : displayValue;
  const isPlaceholder = !hasMatch && !!placeholder;
  const bare = variant === 'bare';
  const block = !bare && !inline;

  const emit = useCallback(
    (val) => {
      const v = String(val);
      if (!isControlled) setInner(v);
      if (onChange) onChange({ target: { name, value: v } });
    },
    [isControlled, onChange, name]
  );

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const width = Math.min(Math.max(r.width, 200), window.innerWidth - margin * 2);
    const left = Math.min(Math.max(r.left, margin), Math.max(margin, window.innerWidth - width - margin));
    const spaceBelow = window.innerHeight - r.bottom;
    const up = spaceBelow < 230 && r.top > 300;
    setPos(
      up
        ? { left, width, up: true, bottom: window.innerHeight - r.top + 6 }
        : { left, width, up: false, top: r.bottom + 6 }
    );
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    place();
    const idx = Math.max(0, opts.findIndex((o) => o.value === displayValue && !o.disabled));
    setActiveIdx(idx);
    setIsOpen(true);
  }, [disabled, place, opts, displayValue]);

  const close = useCallback((refocus) => {
    setIsOpen(false);
    setActiveIdx(-1);
    setTypeBuf('');
    if (refocus && triggerRef.current) triggerRef.current.focus();
  }, []);

  // Reposition on scroll / resize + dismiss on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    place();
    const onScroll = () => place();
    const onResize = () => place();
    const onDown = (e) => {
      const t = e.target;
      if (
        triggerRef.current && !triggerRef.current.contains(t) &&
        panelRef.current && !panelRef.current.contains(t)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onDown);
    };
  }, [isOpen, place]);

  // Keep enabled option visible while keyboard-navigating
  useEffect(() => {
    if (!isOpen || !panelRef.current || activeIdx < 0) return;
    const node = panelRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (node) node.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIdx]);

  const moveActive = useCallback(
    (dir) => {
      if (!opts.length) return;
      let i = activeIdx;
      for (let step = 0; step < opts.length; step++) {
        i = (i + dir + opts.length) % opts.length;
        if (!opts[i].disabled) break;
      }
      setActiveIdx(i);
    },
    [activeIdx, opts]
  );

  const jumpToLetter = useCallback(
    (ch) => {
      const buf = (typeBuf + ch).slice(-12);
      setTypeBuf(buf);
      if (typeTimer.current) clearTimeout(typeTimer.current);
      typeTimer.current = setTimeout(() => setTypeBuf(''), 600);
      const idx = opts.findIndex(
        (o) => !o.disabled && childText(o.label).toLowerCase().startsWith(buf.toLowerCase())
      );
      if (idx >= 0) setActiveIdx(idx);
    },
    [typeBuf, opts]
  );

  const onPanelKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    }
  };

  const onTriggerKey = (e) => {
    if (disabled) return;
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open();
      return;
    }
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const i = opts.findIndex((o) => !o.disabled);
      if (i >= 0) setActiveIdx(i);
    } else if (e.key === 'End') {
      e.preventDefault();
      for (let i = opts.length - 1; i >= 0; i--) {
        if (!opts[i].disabled) {
          setActiveIdx(i);
          break;
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = opts[activeIdx];
      if (opt && !opt.disabled) {
        emit(opt.value);
        close(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close(false);
    } else if (e.key.length === 1) {
      jumpToLetter(e.key);
    }
  };

  return (
    <span
      className={`glass-select${bare ? ' glass-select--bare' : ''}${block ? ' glass-select--block' : ''}${disabled ? ' glass-select--disabled' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {label && (
        <span className="glass-field-label">
          {label} {required && <i className="glass-required">*</i>}
        </span>
      )}
      <span className="glass-select__wrap">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
          onClick={() => (isOpen ? close(false) : open())}
          onKeyDown={onTriggerKey}
          className={`glass-trigger${isOpen ? ' glass-trigger--open' : ''}${isPlaceholder ? ' glass-trigger--placeholder' : ''}`}
        >
          {icon && !bare && <span className="material-symbols-outlined glass-trigger__icon">{icon}</span>}
          <span className="glass-trigger__text">{shownLabel}</span>
          <span className={`material-symbols-outlined glass-trigger__chevron${isOpen ? ' glass-trigger__chevron--open' : ''}`}>
            expand_more
          </span>
        </button>

        {/* Hidden native mirror preserves required validation + semantics */}
        {required && (
          <select
            aria-hidden="true"
            tabIndex={-1}
            name={name}
            required
            disabled={disabled}
            value={hasMatch ? displayValue : ''}
            onChange={() => {}}
            className="glass-mirror"
          >
            {opts.map((o, i) => (
              <option key={o.key ?? i} value={o.value} disabled={o.disabled}>
                {childText(o.label)}
              </option>
            ))}
            {!hasMatch && displayValue !== '' && <option value={displayValue}>{displayValue}</option>}
          </select>
        )}

        {isOpen &&
          createPortal(
            <div
              ref={panelRef}
              role="listbox"
              aria-label={ariaLabel || (typeof label === 'string' ? label : 'Options')}
              onKeyDown={onPanelKey}
              className={`glass-panel glass-pop${pos.up ? ' glass-panel--up' : ''}`}
              style={{
                position: 'fixed',
                left: pos.left,
                width: pos.width,
                ...(pos.up ? { bottom: pos.bottom } : { top: pos.top }),
                zIndex: 400,
              }}
            >
              <div className="glass-panel__sheen" />
              {opts.map((o, i) => {
                const isSel = o.value === displayValue;
                return (
                  <button
                    key={o.key ?? i}
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    disabled={o.disabled}
                    data-idx={i}
                    tabIndex={-1}
                    onMouseEnter={() => !o.disabled && setActiveIdx(i)}
                    onClick={() => {
                      if (o.disabled) return;
                      emit(o.value);
                      close(true);
                    }}
                    className={`glass-option${isSel ? ' glass-option--selected' : ''}${i === activeIdx ? ' glass-option--active' : ''}${o.disabled ? ' glass-option--disabled' : ''}`}
                  >
                    <span className="glass-option__label">{o.label}</span>
                    {isSel && <span className="material-symbols-outlined glass-option__check">check</span>}
                  </button>
                );
              })}
              {opts.length === 0 && <div className="glass-option glass-option--disabled">No options</div>}
            </div>,
            document.body
          )}
      </span>
    </span>
  );
}
