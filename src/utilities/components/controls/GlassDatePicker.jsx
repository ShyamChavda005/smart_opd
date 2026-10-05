// ============================================================
//  GlassDatePicker.jsx – Shared glassmorphic calendar (UI-only)
//  Drop-in replacement for <input type="date">:
//    <GlassDatePicker value onChange name required disabled
//      placeholder min max label icon />
//  value is 'YYYY-MM-DD'. Emits onChange({ target: { name, value } }).
//  Uncontrolled when `value` is undefined (uses defaultValue).
// ============================================================

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseISO(s) {
  if (typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null;
  return d;
}

function fmtISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function pretty(date) {
  if (!date) return '';
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

function todayLocal() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export default function GlassDatePicker({
  value,
  defaultValue,
  onChange,
  name,
  required,
  disabled,
  placeholder,
  min,
  max,
  label,
  icon,
  className,
  style,
  ariaLabel,
}) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue !== undefined ? String(defaultValue) : '');
  const strValue = isControlled ? String(value ?? '') : inner;
  const selected = useMemo(() => parseISO(strValue), [strValue]);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('days'); // days | months | years
  const [view, setView] = useState(() => {
    const base = parseISO(isControlled ? value : inner) || todayLocal();
    return { y: base.getFullYear(), m: base.getMonth() };
  });
  const [focusDay, setFocusDay] = useState(null);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 300 });
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const minD = useMemo(() => parseISO(min), [min]);
  const maxD = useMemo(() => parseISO(max), [max]);
  const inRange = useCallback(
    (iso) => {
      if (!iso) return true;
      if (min && iso < min) return false;
      if (max && iso > max) return false;
      return true;
    },
    [min, max]
  );

  const yearLo = minD ? minD.getFullYear() : todayLocal().getFullYear() - 100;
  const yearHi = maxD ? maxD.getFullYear() : todayLocal().getFullYear() + 10;
  const years = useMemo(() => {
    const arr = [];
    for (let y = yearHi; y >= yearLo; y--) arr.push(y);
    return arr;
  }, [yearLo, yearHi]);

  // Keep the viewed month in sync when the value changes externally
  useEffect(() => {
    if (!isOpen && selected) setView({ y: selected.getFullYear(), m: selected.getMonth() });
  }, [isOpen, selected]);

  const emit = useCallback(
    (iso) => {
      const v = String(iso ?? '');
      if (!isControlled) setInner(v);
      if (onChange) onChange({ target: { name, value: v } });
    },
    [isControlled, onChange, name]
  );

  const clampToday = useCallback(() => {
    const t = todayLocal();
    const iso = fmtISO(t.getFullYear(), t.getMonth(), t.getDate());
    if (iso < (min || '')) return min;
    if (max && iso > max) return max;
    return iso;
  }, [min, max]);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const width = Math.min(Math.max(r.width, 300), window.innerWidth - margin * 2);
    const left = Math.min(Math.max(r.left, margin), Math.max(margin, window.innerWidth - width - margin));
    const spaceBelow = window.innerHeight - r.bottom;
    const up = spaceBelow < 380 && r.top > 400;
    setPos(
      up
        ? { left, width, up: true, bottom: window.innerHeight - r.top + 6 }
        : { left, width, up: false, top: r.bottom + 6 }
    );
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    const base = selected || todayLocal();
    setView({ y: base.getFullYear(), m: base.getMonth() });
    setFocusDay(selected ? selected.getDate() : base.getDate());
    setMode('days');
    place();
    setIsOpen(true);
  }, [disabled, selected, place]);

  const close = useCallback((refocus) => {
    setIsOpen(false);
    setMode('days');
    if (refocus && triggerRef.current) triggerRef.current.focus();
  }, []);

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

  const shiftMonth = (dir) => {
    setView((v) => {
      const d = new Date(v.y, v.m + dir, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const pick = (day) => {
    const iso = fmtISO(view.y, view.m, day);
    if (!inRange(iso)) return;
    emit(iso);
    close(true);
  };

  const onPanelKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (mode !== 'days') return;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    let f = focusDay || 1;
    if (e.key === 'ArrowLeft') f -= 1;
    else if (e.key === 'ArrowRight') f += 1;
    else if (e.key === 'ArrowUp') f -= 7;
    else if (e.key === 'ArrowDown') f += 7;
    else if (e.key === 'Enter') {
      const iso = fmtISO(view.y, view.m, f);
      if (f >= 1 && f <= daysInMonth && inRange(iso)) {
        e.preventDefault();
        pick(f);
      }
      return;
    } else return;
    e.preventDefault();
    f = Math.min(Math.max(f, 1), daysInMonth);
    setFocusDay(f);
    if (panelRef.current) {
      const node = panelRef.current.querySelector(`[data-day="${f}"]`);
      if (node) node.focus({ preventScroll: true });
    }
  };

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const leadBlanks = new Date(view.y, view.m, 1).getDay();
  const cells = [];
  for (let i = 0; i < leadBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const today = todayLocal();

  const shown = selected ? pretty(selected) : '';
  const holder = placeholder || 'dd/mm/yyyy';

  return (
    <span className={`glass-date${disabled ? ' glass-date--disabled' : ''}${className ? ` ${className}` : ''}`} style={style}>
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
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={ariaLabel || (typeof label === 'string' ? label : 'Choose date')}
          onClick={() => (isOpen ? close(false) : open())}
          onKeyDown={(e) => {
            if (disabled) return;
            if (!isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
              e.preventDefault();
              open();
            } else if (isOpen && e.key === 'Escape') {
              e.preventDefault();
              close(true);
            }
          }}
          className={`glass-trigger${isOpen ? ' glass-trigger--open' : ''}${!selected ? ' glass-trigger--placeholder' : ''}`}
        >
          <span className={`glass-trigger__text${!selected ? ' glass-trigger__text--empty' : ''}`}>
            {shown || holder}
          </span>
          <span className="glass-trigger__iconbox">
            <span className="material-symbols-outlined glass-trigger__icon">{icon || 'calendar_today'}</span>
          </span>
        </button>

        {required && (
          <input
            aria-hidden="true"
            tabIndex={-1}
            type="date"
            name={name}
            required
            disabled={disabled}
            min={min}
            max={max}
            value={inRange(strValue) ? strValue : ''}
            onChange={() => {}}
            className="glass-mirror"
          />
        )}

        {isOpen &&
          createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label="Choose date"
              onKeyDown={onPanelKey}
              className="glass-panel glass-calendar glass-pop"
              style={{
                position: 'fixed',
                left: pos.left,
                width: pos.width,
                ...(pos.up ? { bottom: pos.bottom } : { top: pos.top }),
                zIndex: 400,
              }}
            >
              <div className="glass-panel__sheen" />
              {/* Header */}
              <div className="glass-cal__header">
                {mode === 'days' ? (
                  <button type="button" className="glass-cal__title" onClick={() => setMode('months')}>
                    {MONTHS[view.m]} <span className="glass-cal__year">{view.y}</span>
                    <span className="material-symbols-outlined glass-cal__caret">expand_more</span>
                  </button>
                ) : (
                  <button type="button" className="glass-cal__title" onClick={() => setMode('days')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>{mode === 'months' ? view.y : `${yearLo} – ${yearHi}`}</span>
                  </button>
                )}
                {mode === 'days' && (
                  <div className="glass-cal__nav">
                    <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)} className="glass-cal__navbtn">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)} className="glass-cal__navbtn">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </div>

              {mode === 'days' && (
                <>
                  <div className="glass-cal__weekdays">
                    {WEEKS.map((w) => (
                      <span key={w}>{w}</span>
                    ))}
                  </div>
                  <div className="glass-cal__grid">
                    {cells.map((day, i) => {
                      if (day === null) return <span key={`b-${i}`} className="glass-cal__day glass-cal__day--blank" />;
                      const iso = fmtISO(view.y, view.m, day);
                      const sel =
                        selected &&
                        selected.getFullYear() === view.y &&
                        selected.getMonth() === view.m &&
                        selected.getDate() === day;
                      const isToday =
                        today.getFullYear() === view.y && today.getMonth() === view.m && today.getDate() === day;
                      const dis = !inRange(iso);
                      return (
                        <button
                          key={day}
                          type="button"
                          data-day={day}
                          disabled={dis}
                          onClick={() => pick(day)}
                          className={`glass-cal__day${sel ? ' glass-cal__day--selected' : ''}${isToday ? ' glass-cal__day--today' : ''}${dis ? ' glass-cal__day--disabled' : ''}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {mode === 'months' && (
                <div className="glass-cal__months">
                  {MONTHS_SHORT.map((mName, mi) => (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => {
                        setView((v) => ({ ...v, m: mi }));
                        setMode('days');
                      }}
                      className={`glass-cal__month${mi === view.m ? ' glass-cal__month--selected' : ''}`}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              )}

              {mode === 'years' && (
                <div className="glass-cal__years">
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setView((v) => ({ ...v, y }));
                        setMode('months');
                      }}
                      className={`glass-cal__yearbtn${y === view.y ? ' glass-cal__yearbtn--selected' : ''}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}

              {/* Month grid also offers quick year jump */}
              {mode === 'months' && (
                <button type="button" onClick={() => setMode('years')} className="glass-cal__jumplink">
                  Jump to year · {view.y}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}

              <div className="glass-cal__footer">
                <button
                  type="button"
                  onClick={() => {
                    emit('');
                    close(true);
                  }}
                  className="glass-cal__footbtn"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    emit(clampToday());
                    close(true);
                  }}
                  className="glass-cal__footbtn glass-cal__footbtn--primary"
                >
                  Today
                </button>
              </div>
            </div>,
            document.body
          )}
      </span>
    </span>
  );
}
