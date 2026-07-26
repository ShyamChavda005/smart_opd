---
name: Core Admin
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#525657'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b6e70'
  on-tertiary-container: '#eff1f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  sidebar_width: 260px
  container_max: 1440px
---

## Brand & Style
The design system is engineered for high-performance administrative environments where clarity, speed of cognition, and data integrity are paramount. The brand personality is professional, authoritative, and focused. It avoids unnecessary ornamentation to prioritize functional density.

The aesthetic follows a **Corporate Modern** approach. It leverages a crisp, minimalist foundation with generous white space to reduce cognitive load. High-contrast interactions ensure accessibility, while subtle depth through soft shadows provides a clear visual hierarchy. The goal is to evoke a sense of reliability and precision in every interaction.

## Colors
The palette is anchored by a vibrant **Corporate Blue**, used strategically for primary actions, active states, and focus indicators. 

- **Primary:** The core driver of the interface. Use for main buttons, progress indicators, and active navigation nodes.
- **Surface & Secondary:** Pure white is used for primary content containers (cards, tables) to maximize contrast against the soft slate-gray background (#f1f5f9).
- **Neutral Ramp:** A balanced range of slates is used for text hierarchy, borders, and disabled states. 
- **Functional Colors:** High-visibility green, amber, and red are reserved strictly for system feedback and data status indicators.

## Typography
The typography system uses **Hanken Grotesk** for headlines to provide a sharp, modern editorial feel, while **Inter** is used for all body text and data-heavy components due to its exceptional legibility at small sizes.

- **Scale:** A tight scale is maintained to ensure data density.
- **Hierarchy:** Use `label-md` for table headers and section overviews to provide a clear distinction from interactive content.
- **Weight:** Reserve bold weights for primary headings and critical semantic labels. Light weights should be avoided to maintain accessibility standards.

## Layout & Spacing
The layout employs a **12-column fluid grid** for the main content area, anchored by a fixed-width left sidebar. 

- **Grid:** On desktop, the main content area has 32px outer margins and 24px gutters. Elements should align to the 4px baseline grid.
- **Sidebar:** A consistent 260px width ensures navigation stability. On mobile, the sidebar collapses into a hamburger menu or bottom navigation bar.
- **Reflow:** As the screen narrows, the 12-column grid transitions to 8 columns (tablet) and 4 columns (mobile). Card paddings should reduce from 24px to 16px on mobile devices to preserve screen real estate.

## Elevation & Depth
This design system utilizes **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy.

- **Level 0 (Background):** The base slate layer (#f1f5f9). No shadows.
- **Level 1 (Cards/Tables):** Pure white surfaces with a soft, diffused shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`.
- **Level 2 (Dropdowns/Popovers):** Higher contrast shadow to separate from card layers: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`.
- **Borders:** Use a subtle 1px border (#e2e8f0) on all Level 1 containers to ensure definition even on low-quality displays.

## Shapes
The shape language is defined by **Rounded** corners to soften the professional aesthetic and make the interface feel modern and approachable.

- **Standard Components:** Buttons, input fields, and small badges use a 0.5rem (8px) radius.
- **Containers:** Large cards and modals use a 1rem (16px) radius to clearly define major content blocks.
- **Interactive States:** Hover states should maintain the same corner radius, often accompanied by a subtle background color shift.

## Components
- **Buttons:** Primary buttons are solid Blue (#2563eb) with white text. Secondary buttons use a white background with a 1px slate border and blue text. All buttons have a subtle transition effect on hover.
- **Inputs:** Fields use a 1px border (#cbd5e1). On focus, the border changes to Primary Blue with a 2px soft outer glow (ring).
- **Data Tables:** Use a "zebra-stripe" or "clean-line" approach. Table headers use the `label-md` type style with a subtle background fill (#f8fafc).
- **Chips/Badges:** Small, high-contrast pills used for status (e.g., "Active", "Pending"). Backgrounds are 10% opacity of the functional color (e.g., soft green background for success text).
- **Cards:** The primary container for all dashboard widgets. Cards should include a consistent 24px internal padding and a 1px bottom border for header sections.
- **Sidebar Nav:** High-contrast active states. The active menu item should feature a vertical primary-colored indicator on the left edge and a subtle background tint.