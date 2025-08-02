# Thunderbird Native Styling Guide

## Overview

This guide provides comprehensive documentation for implementing native Thunderbird styling in add-ons. It's based on real-world experience implementing Quick Filter button styling and other UI components that seamlessly integrate with Thunderbird's native appearance.

Thunderbird uses a sophisticated color system with CSS variables that automatically adapt to light/dark themes and user preferences. The key to native styling is leveraging these variables instead of hardcoded colors, and understanding Thunderbird's specific UI patterns.

## Essential CSS Variables

### Color System Variables

#### Background Colors
```css
--layout-background-0: light-dark(#ffffff, #2a2a2e);  /* Primary background */
--layout-background-1: light-dark(#f5f5f5, #38383d);  /* Secondary background */
--layout-background-2: light-dark(#f4f4f5, #3f3f46);  /* Tertiary background */
```

#### Text Colors
```css
--layout-color-1: light-dark(#0c0c0d, #f9f9fa);  /* Primary text */
--layout-color-2: light-dark(#4a4a4f, #b1b1b3);  /* Secondary text */
```

#### Border and Selection
```css
--layout-border-0: light-dark(#d7d7db, #52525e);     /* Standard borders */
--selected-item-color: light-dark(#0060df, #0a84ff); /* Selection/accent color */
--selected-item-text-color: light-dark(#ffffff, #ffffff); /* Selected text */
```

### Button Styling Variables

#### Basic Button Properties
```css
--button-background-color: light-dark(#e4e4e7, #52525b);
--button-border-color: light-dark(#a1a1aa, #71717a);
--button-border-size: 1px;
--button-padding: 6px;
--button-border-radius: 3px;
```

#### Interactive States
```css
--toolbar-button-hover-background-color: color-mix(in srgb, currentColor 10%, transparent);
--toolbar-button-active-background-color: color-mix(in srgb, currentColor 20%, transparent);
```

### System Accent Colors

#### Accent Color System
```css
--system-accent-color: light-dark(var(--selected-item-color), var(--selected-item-color));
--system-accent-subtle: light-dark(rgba(0, 96, 223, 0.08), rgba(10, 132, 255, 0.12));
--system-accent-hover: light-dark(rgba(0, 96, 223, 0.12), rgba(10, 132, 255, 0.18));
--system-accent-border: light-dark(rgba(0, 96, 223, 0.15), rgba(10, 132, 255, 0.25));
```

#### Modern System Accent Support
```css
@supports (color: AccentColor) {
  :root {
    --system-accent-color: AccentColor;
    --system-accent-subtle: color-mix(in srgb, AccentColor 8%, transparent);
    --system-accent-hover: color-mix(in srgb, AccentColor 15%, transparent);
    --system-accent-border: color-mix(in srgb, AccentColor 20%, transparent);
  }
}
```

### Layout and Spacing Variables

```css
--message-spacing: 0;
--message-padding: 12px 16px;
--border-radius: 0;  /* Thunderbird prefers sharp corners */
--native-font: -moz-default;
```

### Icon Styling Variables

```css
--icon-size: 18px;
-moz-context-properties: fill, stroke;
fill: color-mix(in srgb, currentColor 20%, transparent);
stroke: currentColor;
```

## Common UI Patterns

### Toolbar Buttons (Quick Filter Style)

The Quick Filter buttons represent Thunderbird's standard toolbar button pattern:

```css
.quickfilter-btn {
  --icon-size: 18px;
  appearance: none;
  background-color: var(--button-background-color);
  color: currentColor;
  border: var(--button-border-size) solid var(--button-border-color);
  border-radius: 0;
  padding: var(--button-padding);
  min-width: 28px;
  height: 28px;
  -moz-context-properties: fill, stroke;
  fill: color-mix(in srgb, currentColor 20%, transparent);
  stroke: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  @media (prefers-reduced-motion: no-preference) {
    transition: background-color .15s, border-color .15s;
  }
}

.quickfilter-btn:hover {
  background-color: var(--toolbar-button-hover-background-color);
}

.quickfilter-btn:active {
  background-color: var(--toolbar-button-active-background-color);
}

.quickfilter-btn.active {
  background-color: var(--toolbar-button-hover-background-color);
}
```

### Button Groups

Thunderbird uses seamless button groups where borders are shared:

```css
.button-group {
  display: inline-flex;
  border-radius: var(--button-border-radius, 3px);
  isolation: isolate;
}

.button-group .quickfilter-btn:first-child {
  border-inline-end: none;
  border-start-start-radius: calc(var(--button-border-radius, 3px) - 1px);
  border-end-start-radius: calc(var(--button-border-radius, 3px) - 1px);
}

.button-group .quickfilter-btn:last-child {
  border-start-end-radius: calc(var(--button-border-radius, 3px) - 1px);
  border-end-end-radius: calc(var(--button-border-radius, 3px) - 1px);
}

.button-group .quickfilter-btn + .quickfilter-btn {
  border-inline-start: none;
}
```

### Icons with Proper Fill/Stroke

Thunderbird icons use a specific pattern for fill and stroke:

```css
.icon {
  width: var(--icon-size);
  height: var(--icon-size);
  fill: color-mix(in srgb, currentColor 20%, transparent);
  stroke: currentColor;
  -moz-context-properties: fill, stroke;
}
```

### Hover/Active/Focus States

Standard interactive states follow this pattern:

```css
/* Hover */
.interactive-element:hover {
  background-color: var(--toolbar-button-hover-background-color);
  color: var(--button-hover-text-color, currentColor);
}

/* Active */
.interactive-element:active {
  background-color: var(--toolbar-button-active-background-color);
}

/* Focus */
.interactive-element:focus-visible {
  outline: var(--focus-outline, 2px solid var(--focus-outline-color, Highlight));
  outline-offset: var(--focus-outline-offset, -2px);
  z-index: 3;
}
```

### Message Cards

For card-like components (like message items):

```css
.message-card {
  border: 1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.1));
  border-radius: 6px;
  background-color: var(--layout-background-0);
  box-shadow: 0 1px 3px light-dark(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.12));
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-card:hover {
  background-color: var(--system-accent-subtle);
  border-color: var(--system-accent-border);
}

.message-card:focus {
  background-color: var(--system-accent-subtle);
  border-color: var(--system-accent-color);
  outline: none;
}
```

## Best Practices

### 1. Always Use Native CSS Variables
- **DO**: Use `var(--layout-background-0)` for backgrounds
- **DON'T**: Use hardcoded colors like `#ffffff` or `#2a2a2e`

### 2. Leverage light-dark() Function
```css
/* Good - adapts to theme automatically */
border: 1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.1));

/* Bad - only works in one theme */
border: 1px solid #e0e0e0;
```

### 3. Use color-mix() for State Variations
```css
/* Good - creates consistent hover states */
background-color: color-mix(in srgb, currentColor 10%, transparent);

/* Bad - hardcoded hover colors */
background-color: #f0f0f0;
```

### 4. Proper -moz-context-properties for Icons
Always include both fill and stroke properties:
```css
.icon {
  -moz-context-properties: fill, stroke;
  fill: color-mix(in srgb, currentColor 20%, transparent);
  stroke: currentColor;
}
```

### 5. Respect User Preferences
```css
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    transition: all 0.15s ease;
  }
}
```

### 6. Use Semantic Font Properties
```css
/* Good - uses system font */
font-family: -moz-default;
font: message-box;

/* Avoid - custom fonts may not match system */
font-family: 'Custom Font', sans-serif;
```

## Conversation Header Implementation

The conversation header demonstrates a complete implementation of native Thunderbird styling patterns, including the icon system, button styling, and tag styling that seamlessly integrates with Thunderbird's native appearance.

### Conversation Header Architecture

The conversation header consists of several key components that work together to provide native Thunderbird styling:

1. **SvgIcon Component** - Handles icon rendering with proper `-moz-context-properties` support
2. **Quick Filter Button Styling** - Matches Thunderbird's native Quick Filter button appearance exactly
3. **Button Group Layout** - Seamless button grouping with shared borders
4. **Tag System** - Native Thunderbird tag button styling with pill-shaped appearance

### SvgIcon Component with Native Styling

The [`SvgIcon`](addon/content/components/svgIcon.mjs) component provides consistent icon rendering with full Thunderbird native styling support:

```javascript
export function SvgIcon({ fullPath, hash, ariaHidden = false, fillOnly = false }) {
  fullPath = fullPath || `material-icons.svg#${hash}`;
  
  // Build style object for Thunderbird native icon styling
  const iconStyle = {
    "--icon-size": "18px",
    "-moz-context-properties": fillOnly ? "fill" : "fill, stroke",
    "fill": "color-mix(in srgb, currentColor 20%, transparent)",
  };
  
  // Only add stroke if not fill-only
  if (!fillOnly) {
    iconStyle.stroke = "currentColor";
  }
  
  return React.createElement("svg", {
    "aria-hidden": ariaHidden,
    className: "icon",
    viewBox: "0 0 24 24",
    style: iconStyle,
  }, React.createElement("use", {
    xlinkHref: `icons/${fullPath}`,
  }));
}
```

**Key Features:**
- **18px icon size** - Standard Thunderbird icon size for toolbar buttons
- **Context-aware properties** - Uses `-moz-context-properties: fill, stroke` for theme adaptation
- **Semi-transparent fill** - `color-mix(in srgb, currentColor 20%, transparent)` for subtle icon appearance
- **Current color stroke** - Ensures icons adapt to text color changes
- **Flexible fill/stroke** - `fillOnly` parameter for icons that don't need stroke

### Native Quick Filter Button Implementation

The conversation header buttons use the [`quickfilter-btn`](addon/content/conversation.css:321) class to match Thunderbird's native Quick Filter appearance exactly:

```css
.actions .quickfilter-btn {
  --icon-size: 18px;
  appearance: none;
  background-color: var(--button-background-color);
  color: currentColor;
  border: var(--button-border-size) solid var(--button-border-color);
  border-radius: 0;
  padding: var(--button-padding);
  min-width: 28px;
  height: 28px;
  -moz-context-properties: fill, stroke;
  fill: color-mix(in srgb, currentColor 20%, transparent);
  stroke: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  @media (prefers-reduced-motion: no-preference) {
    transition: background-color .15s, border-color .15s;
  }
}
```

**Implementation Details:**
- **Sharp corners** - `border-radius: 0` matches Thunderbird's preference for sharp edges
- **28px dimensions** - Standard Thunderbird toolbar button size (28x28px)
- **Native variables** - Uses `--button-background-color` and `--button-border-color` for theme consistency
- **Icon integration** - Direct `-moz-context-properties` support for embedded icons
- **Smooth transitions** - Respects `prefers-reduced-motion` for accessibility

### Button Group Styling with Seamless Borders

The conversation header implements seamless button groups where borders are shared between adjacent buttons:

```css
/* Button group styling - seamless borders */
.actions .quickfilter-btn:first-child {
  border-inline-end: none;
  border-start-start-radius: calc(var(--button-border-radius, 3px) - 1px);
  border-end-start-radius: calc(var(--button-border-radius, 3px) - 1px);
}

.actions .quickfilter-btn:last-child {
  border-start-end-radius: calc(var(--button-border-radius, 3px) - 1px);
  border-end-end-radius: calc(var(--button-border-radius, 3px) - 1px);
}

.actions .quickfilter-btn + .quickfilter-btn {
  border-inline-start: none;
}

.actions {
  display: inline-flex;
  border-radius: var(--button-border-radius, 3px);
  margin-left: auto;
  isolation: isolate;
}
```

**Key Features:**
- **Shared borders** - Adjacent buttons share borders to prevent double-border appearance
- **Corner radius only on ends** - Only first and last buttons have rounded corners (3px)
- **Logical properties** - Uses `border-inline-start/end` for RTL language support
- **Isolation context** - `isolation: isolate` prevents z-index issues

### Interactive States

All buttons implement consistent interactive states that match Thunderbird's native behavior:

```css
.actions .quickfilter-btn:hover {
  background-color: var(--toolbar-button-hover-background-color);
}

.actions .quickfilter-btn:active {
  background-color: var(--toolbar-button-active-background-color);
}

.actions .quickfilter-btn.active {
  background-color: var(--toolbar-button-hover-background-color);
}

.actions .quickfilter-btn:focus-visible {
  outline: 2px solid var(--focus-outline-color, Highlight);
  outline-offset: -2px;
  z-index: 3;
}
```

**State Management:**
- **Hover state** - Uses `color-mix()` for consistent transparency overlay
- **Active state** - Slightly darker than hover for pressed appearance
- **Focus state** - High-contrast outline for keyboard navigation
- **Active button state** - Persistent highlight for toggled buttons (like read/unread)

### Native Tag Button Styling

Tags in the conversation use pill-shaped styling that matches Thunderbird's native tag buttons with **transparent backgrounds and colored borders**:

```css
.tags li {
  --tag-color: currentColor;
  --tag-contrast-color: currentColor;
  display: inline-block;
  font-size: 1rem;
  line-height: 1;
  padding: 3px 9px;
  margin-inline-end: 6px;
  border-radius: 100px;
  background-color: transparent;
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
  min-height: 0;
  min-width: 0;
  transition: background-color 0.15s ease;
}

.tags li:hover {
  background-color: color-mix(in srgb, var(--tag-color) 20%, transparent);
}
```

**Tag Styling Features:**
- **Pill shape** - `border-radius: 100px` creates perfect pill appearance matching native Thunderbird tags
- **Transparent background** - `background-color: transparent` - only colored border and text, no fill
- **Colored border and text** - Both border and text use the tag's color via `--tag-color`
- **Hover effect** - Semi-transparent background on hover using `color-mix()` for subtle feedback
- **Compact padding** - `3px 9px` for tight, native appearance

### Special Tags Implementation

Special tags (like encryption status, attachments, etc.) use the same transparent background pattern:

```css
.tags.special-tags li {
  --tag-color: light-dark(#4a5568, #e2e8f0);
  background-color: transparent;
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
  border-radius: 100px;
  padding: 3px 9px;
  line-height: 1;
}

.tags.special-tags li:hover {
  background-color: color-mix(in srgb, var(--tag-color) 20%, transparent);
}
```

**Special Tag Features:**
- **Theme-aware colors** - Uses `light-dark()` for automatic theme adaptation
- **Consistent transparent appearance** - Same pill shape and transparent background as regular tags
- **Icon integration** - Works seamlessly with [`SvgIcon`](addon/content/components/svgIcon.mjs) component
- **Interactive feedback** - Hover states for clickable special tags

### Key CSS Variables Used in Conversation Header

The conversation header implementation leverages a comprehensive set of CSS variables that ensure consistent theming and native Thunderbird appearance:

#### Button System Variables
```css
/* Core button styling */
--button-background-color: light-dark(#e4e4e7, #52525b);
--button-border-color: light-dark(#a1a1aa, #71717a);
--button-border-size: 1px;
--button-padding: 6px;
--button-border-radius: 3px;

/* Interactive states */
--toolbar-button-hover-background-color: color-mix(in srgb, currentColor 17%, transparent);
--toolbar-button-active-background-color: color-mix(in srgb, currentColor 30%, transparent);

/* Focus states */
--focus-outline-color: AccentColor;
--focus-outline: 2px solid var(--focus-outline-color, Highlight);
--focus-outline-offset: 2px;
```

#### Icon System Variables
```css
/* Icon sizing and properties */
--icon-size: 18px;
-moz-context-properties: fill, stroke;
fill: color-mix(in srgb, currentColor 20%, transparent);
stroke: currentColor;
```

#### Layout and Color Variables
```css
/* Enhanced Thunderbird Native Color System */
--layout-background-0: light-dark(#ffffff, #18181b);
--layout-background-1: light-dark(#fafafa, #27272a);
--layout-color-1: light-dark(#18181b, #f4f4f5);
--layout-color-2: light-dark(#3f3f46, #d4d4d8);
--layout-border-0: light-dark(#d4d4d8, #3f3f46);
```

### Implementation Patterns

#### 1. Theme-Aware Color Functions
The implementation extensively uses modern CSS functions for automatic theme adaptation:

```css
/* light-dark() for automatic theme switching */
--button-background-color: light-dark(#e4e4e7, #52525b);

/* color-mix() for consistent state variations */
background-color: color-mix(in srgb, currentColor 17%, transparent);

/* AccentColor for system integration */
--focus-outline-color: AccentColor;
```

#### 2. Sharp Corner Design Philosophy
Following Thunderbird's design language, the implementation uses sharp corners:

```css
/* Sharp corners for buttons (Thunderbird preference) */
border-radius: 0;

/* Only button groups get subtle corner radius */
border-radius: var(--button-border-radius, 3px);
```

#### 3. Consistent Icon Integration
All icons use the same pattern for theme-aware rendering:

```css
.icon {
  width: var(--icon-size);
  height: var(--icon-size);
  -moz-context-properties: fill, stroke;
  fill: color-mix(in srgb, currentColor 20%, transparent);
  stroke: currentColor;
}
```

#### 4. Accessibility-First Interactive States
All interactive elements include proper focus management:

```css
.quickfilter-btn:focus-visible {
  outline: 2px solid var(--focus-outline-color, Highlight);
  outline-offset: -2px;
  z-index: 3;
}

@media (prefers-reduced-motion: no-preference) {
  transition: background-color .15s, border-color .15s;
}
```

### Migration Benefits

The conversation header implementation demonstrates several key benefits of native Thunderbird styling:

1. **Automatic Theme Adaptation** - All colors automatically adapt to light/dark themes
2. **System Integration** - Uses system accent colors when available
3. **Accessibility Compliance** - Proper focus states and reduced motion support
4. **Performance** - Leverages CSS variables for efficient theme switching
5. **Maintainability** - Centralized color system makes updates easier
6. **Consistency** - Matches native Thunderbird UI patterns exactly

## Code Examples

### Complete Quick Filter Button Implementation

```css
.quickfilter-btn {
  --icon-size: 18px;
  --button-margin: 0;
  appearance: none;
  background-color: var(--button-background-color);
  color: currentColor;
  border: var(--button-border-size) solid var(--button-border-color);
  border-radius: 0;
  padding: var(--button-padding);
  margin: 0;
  margin-block: 2px;
  min-width: 28px;
  height: 28px;
  -moz-context-properties: fill, stroke;
  fill: color-mix(in srgb, currentColor 20%, transparent);
  stroke: currentColor;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 2;

  @media (prefers-reduced-motion: no-preference) {
    transition: background-color .15s, border-color .15s;
  }
}
```

### Icon Link Pattern

```css
.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--layout-color-2);
  padding: 6px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 32px;
  min-height: 32px;
}

.icon-link:hover {
  color: var(--layout-color-1);
  background-color: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.08));
  transform: translateY(-1px);
}
```

## Common Pitfalls

### 1. Double Borders in Button Groups
**Problem**: Each button has its own border, creating double borders between buttons.
**Solution**: Remove `border-inline-start: none` or `border-inline-end: none` on adjacent buttons.

### 2. Transparent Backgrounds When They Should Be Visible
**Problem**: Using `background: transparent` when the button should have a visible background.
**Solution**: Use `var(--button-background-color)` for toolbar buttons.

### 3. Hardcoded Colors
**Problem**: Using fixed colors that don't adapt to themes.
**Solution**: Always use CSS variables and `light-dark()` function.

### 4. Incorrect Icon Context Properties
**Problem**: Icons not displaying correctly or not adapting to theme.
**Solution**: Always include `-moz-context-properties: fill, stroke;` and set appropriate fill/stroke values.

### 5. Missing Focus States
**Problem**: Buttons not accessible via keyboard navigation.
**Solution**: Always implement `:focus-visible` styles with proper outline and z-index.

### 6. Inconsistent Spacing
**Problem**: Custom spacing that doesn't match Thunderbird's design system.
**Solution**: Use standard padding values like `6px`, `8px`, `12px`, `16px`.

### 7. Wrong Border Radius
**Problem**: Using rounded corners when Thunderbird prefers sharp edges.
**Solution**: Use `border-radius: 0` for most elements, or `3px` for button groups.

## Thunderbird Native CSS Variables Reference

### Layout Colors and Backgrounds

Based on comprehensive analysis of Thunderbird's native CSS, these variables provide the foundation for consistent theming:

```css
/* Primary Layout Colors */
--layout-background-0: light-dark(#ffffff, #2a2a2e);  /* Main background */
--layout-background-1: light-dark(#f5f5f5, #38383d);  /* Secondary background */
--layout-background-2: light-dark(#f4f4f5, #3f3f46);  /* Tertiary background */
--layout-background-3: light-dark(#ebebeb, #4a4a4f);  /* Quaternary background */

/* Content Area Backgrounds */
--content-background-color: light-dark(#ffffff, #2a2a2e);
--sidebar-background-color: light-dark(#f9f9fb, #38383d);
--toolbar-background-color: light-dark(#f9f9fb, #2b2a33);

/* Text Colors */
--layout-color-0: light-dark(#15141a, #fbfbfe);  /* Highest contrast text */
--layout-color-1: light-dark(#0c0c0d, #f9f9fa);  /* Primary text */
--layout-color-2: light-dark(#4a4a4f, #b1b1b3);  /* Secondary text */
--layout-color-3: light-dark(#737373, #8f8f9d);  /* Tertiary text */

/* Border Colors */
--layout-border-0: light-dark(#d7d7db, #52525e);  /* Standard borders */
--layout-border-1: light-dark(#e0e0e6, #42414d);  /* Subtle borders */
```

### Semantic Colors

Thunderbird uses a comprehensive semantic color system for consistent messaging:

```css
/* Success Colors */
--success-color: light-dark(#017e40, #54ffbd);
--success-background: light-dark(rgba(1, 126, 64, 0.1), rgba(84, 255, 189, 0.15));
--success-border: light-dark(rgba(1, 126, 64, 0.3), rgba(84, 255, 189, 0.4));

/* Warning Colors */
--warning-color: light-dark(#a47f00, #ffbd4f);
--warning-background: light-dark(rgba(164, 127, 0, 0.1), rgba(255, 189, 79, 0.15));
--warning-border: light-dark(rgba(164, 127, 0, 0.3), rgba(255, 189, 79, 0.4));

/* Danger/Error Colors */
--danger-color: light-dark(#d70022, #ff9aa2);
--danger-background: light-dark(rgba(215, 0, 34, 0.1), rgba(255, 154, 162, 0.15));
--danger-border: light-dark(rgba(215, 0, 34, 0.3), rgba(255, 154, 162, 0.4));

/* Primary/Accent Colors */
--primary-color: light-dark(#0060df, #0a84ff);
--primary-background: light-dark(rgba(0, 96, 223, 0.1), rgba(10, 132, 255, 0.15));
--primary-border: light-dark(rgba(0, 96, 223, 0.3), rgba(10, 132, 255, 0.4));

/* Info Colors */
--info-color: light-dark(#0060df, #80ebff);
--info-background: light-dark(rgba(0, 96, 223, 0.1), rgba(128, 235, 255, 0.15));
--info-border: light-dark(rgba(0, 96, 223, 0.3), rgba(128, 235, 255, 0.4));
```

### Button System Variables

Thunderbird's comprehensive button system supports multiple variants:

```css
/* Base Button Properties */
--button-background-color: light-dark(#e4e4e7, #52525b);
--button-border-color: light-dark(#a1a1aa, #71717a);
--button-text-color: light-dark(#0c0c0d, #f9f9fa);
--button-border-size: 1px;
--button-padding: 6px 12px;
--button-border-radius: 3px;
--button-min-height: 32px;

/* Primary Button */
--button-primary-background: var(--primary-color);
--button-primary-text: light-dark(#ffffff, #ffffff);
--button-primary-border: var(--primary-color);

/* Secondary Button */
--button-secondary-background: transparent;
--button-secondary-text: var(--primary-color);
--button-secondary-border: var(--primary-color);

/* Ghost Button */
--button-ghost-background: transparent;
--button-ghost-text: var(--layout-color-1);
--button-ghost-border: transparent;

/* Danger Button */
--button-danger-background: var(--danger-color);
--button-danger-text: light-dark(#ffffff, #ffffff);
--button-danger-border: var(--danger-color);

/* Interactive States */
--button-hover-background: color-mix(in srgb, var(--button-background-color) 90%, var(--layout-color-1));
--button-active-background: color-mix(in srgb, var(--button-background-color) 80%, var(--layout-color-1));
--button-focus-outline: 2px solid var(--primary-color);
--button-focus-outline-offset: 2px;
```

### Shadow System

Thunderbird uses a sophisticated shadow system for depth hierarchy:

```css
/* Shadow Levels */
--shadow-level-1: 0 1px 3px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.24));
--shadow-level-2: 0 3px 6px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.32));
--shadow-level-3: 0 10px 20px light-dark(rgba(0, 0, 0, 0.19), rgba(0, 0, 0, 0.38));
--shadow-level-4: 0 14px 28px light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.50));

/* Card Shadows */
--card-shadow: var(--shadow-level-1);
--card-shadow-hover: var(--shadow-level-2);
--card-shadow-active: var(--shadow-level-3);

/* Popup/Modal Shadows */
--popup-shadow: var(--shadow-level-3);
--modal-shadow: var(--shadow-level-4);

/* Inset Shadows */
--inset-shadow: inset 0 1px 3px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
```

### Border Radius Tokens

```css
/* Border Radius System */
--border-radius-small: 2px;
--border-radius-medium: 4px;
--border-radius-large: 6px;
--border-radius-xlarge: 8px;
--border-radius-round: 50%;

/* Component-Specific Radius */
--button-border-radius: var(--border-radius-small);
--card-border-radius: var(--border-radius-large);
--input-border-radius: var(--border-radius-small);
--modal-border-radius: var(--border-radius-large);
```

### Icon Variables

Key messaging and UI icons with proper context properties:

```css
/* Icon Sizing */
--icon-size-small: 16px;
--icon-size-medium: 18px;
--icon-size-large: 24px;
--icon-size-xlarge: 32px;

/* Icon Colors */
--icon-color-primary: var(--layout-color-1);
--icon-color-secondary: var(--layout-color-2);
--icon-color-accent: var(--primary-color);
--icon-color-success: var(--success-color);
--icon-color-warning: var(--warning-color);
--icon-color-danger: var(--danger-color);

/* Icon Context Properties */
-moz-context-properties: fill, stroke;
fill: color-mix(in srgb, currentColor 20%, transparent);
stroke: currentColor;

/* Specific Message Icons */
--icon-attachment: url("chrome://messenger/skin/icons/attachment.svg");
--icon-reply: url("chrome://messenger/skin/icons/reply.svg");
--icon-forward: url("chrome://messenger/skin/icons/forward.svg");
--icon-star: url("chrome://messenger/skin/icons/star.svg");
--icon-important: url("chrome://messenger/skin/icons/important.svg");
--icon-thread: url("chrome://messenger/skin/icons/thread.svg");
```

### Typography and Spacing Variables

```css
/* Typography Scale */
--font-size-small: 11px;
--font-size-medium: 13px;
--font-size-large: 15px;
--font-size-xlarge: 18px;

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.4;
--line-height-relaxed: 1.6;

/* Spacing Scale */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 48px;

/* Component Spacing */
--message-padding: var(--spacing-md) var(--spacing-lg);
--card-padding: var(--spacing-lg);
--button-padding: var(--spacing-sm) var(--spacing-md);
```

### Interactive State Variables

```css
/* Hover States */
--hover-background: color-mix(in srgb, currentColor 8%, transparent);
--hover-border: color-mix(in srgb, currentColor 15%, transparent);
--hover-text: var(--layout-color-0);

/* Active States */
--active-background: color-mix(in srgb, currentColor 12%, transparent);
--active-border: color-mix(in srgb, currentColor 20%, transparent);

/* Focus States */
--focus-outline-color: var(--primary-color);
--focus-outline-width: 2px;
--focus-outline-offset: 2px;
--focus-outline: var(--focus-outline-width) solid var(--focus-outline-color);

/* Selection States */
--selection-background: var(--primary-background);
--selection-border: var(--primary-border);
--selection-text: var(--layout-color-0);
```

## Variable Mapping Table

This table shows how Thunderbird's native variables correspond to existing add-on variables:

| **Category** | **Thunderbird Variable** | **Current Add-on Variable** | **Migration Priority** |
|--------------|--------------------------|----------------------------|------------------------|
| **Backgrounds** | `--layout-background-0` | `--background-color` | High |
| | `--layout-background-1` | `--secondary-background` | High |
| | `--content-background-color` | `--message-background` | Medium |
| **Text Colors** | `--layout-color-1` | `--text-color` | High |
| | `--layout-color-2` | `--secondary-text` | High |
| **Borders** | `--layout-border-0` | `--border-color` | Medium |
| **Buttons** | `--button-background-color` | `--btn-background` | High |
| | `--button-border-color` | `--btn-border` | High |
| **Shadows** | `--shadow-level-1` | `--card-shadow` | Low |
| | `--shadow-level-2` | `--hover-shadow` | Low |
| **Semantic** | `--success-color` | `--green-color` | Medium |
| | `--warning-color` | `--yellow-color` | Medium |
| | `--danger-color` | `--red-color` | Medium |
| **Interactive** | `--hover-background` | `--hover-bg` | High |
| | `--focus-outline` | `--focus-ring` | Medium |

## Implementation Recommendations

### Color System Migration Strategy

1. **Phase 1: Core Colors (High Priority)**
   - Replace hardcoded background colors with `--layout-background-*` variables
   - Update text colors to use `--layout-color-*` hierarchy
   - Implement button color system with native variables

2. **Phase 2: Interactive States (High Priority)**
   - Migrate hover/active states to use `color-mix()` functions
   - Implement consistent focus outline system
   - Update selection states to match native patterns

3. **Phase 3: Semantic Colors (Medium Priority)**
   - Replace custom success/warning/error colors with semantic variables
   - Update notification styling to use semantic color system
   - Implement consistent icon coloring

4. **Phase 4: Advanced Features (Low Priority)**
   - Implement shadow depth hierarchy
   - Add modern CSS features (oklch, color-mix enhancements)
   - Optimize for system accent color support

### Shadow Depth Hierarchy for Message Cards

Implement a consistent shadow system for message cards based on interaction state:

```css
.message-card {
  box-shadow: var(--card-shadow);
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-card:hover {
  box-shadow: var(--card-shadow-hover);
}

.message-card:focus,
.message-card.selected {
  box-shadow: var(--card-shadow-active);
}

.message-card.expanded {
  box-shadow: var(--shadow-level-3);
}
```

### Button Variant Implementation

Create a comprehensive button system matching Thunderbird's native patterns:

```css
/* Base Button Class */
.btn {
  background: var(--button-background-color);
  color: var(--button-text-color);
  border: var(--button-border-size) solid var(--button-border-color);
  border-radius: var(--button-border-radius);
  padding: var(--button-padding);
  min-height: var(--button-min-height);
  font-size: var(--font-size-medium);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button Variants */
.btn-primary {
  background: var(--button-primary-background);
  color: var(--button-primary-text);
  border-color: var(--button-primary-border);
}

.btn-secondary {
  background: var(--button-secondary-background);
  color: var(--button-secondary-text);
  border-color: var(--button-secondary-border);
}

.btn-ghost {
  background: var(--button-ghost-background);
  color: var(--button-ghost-text);
  border-color: var(--button-ghost-border);
}

.btn-danger {
  background: var(--button-danger-background);
  color: var(--button-danger-text);
  border-color: var(--button-danger-border);
}
```

### Icon System Integration Approach

1. **Standardize Icon Sizing**
   - Use consistent icon size variables (`--icon-size-*`)
   - Implement responsive icon sizing for different contexts

2. **Proper Context Properties**
   - Ensure all SVG icons include `-moz-context-properties: fill, stroke`
   - Use semantic icon colors for consistent theming

3. **Icon Color System**
   ```css
   .icon {
     width: var(--icon-size-medium);
     height: var(--icon-size-medium);
     -moz-context-properties: fill, stroke;
     fill: var(--icon-color-primary);
     stroke: currentColor;
   }
   
   .icon-accent { fill: var(--icon-color-accent); }
   .icon-success { fill: var(--icon-color-success); }
   .icon-warning { fill: var(--icon-color-warning); }
   .icon-danger { fill: var(--icon-color-danger); }
   ```

## Modern CSS Features Used

### light-dark() Function
Thunderbird extensively uses the `light-dark()` function for automatic theme adaptation:

```css
/* Automatically adapts to light/dark theme */
background-color: light-dark(#ffffff, #2a2a2e);
border-color: light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.2));
```

### color-mix() Function
Used for creating consistent state variations and transparency effects:

```css
/* Hover states with consistent opacity */
background-color: color-mix(in srgb, currentColor 10%, transparent);

/* Semantic color variations */
background-color: color-mix(in srgb, var(--success-color) 15%, transparent);
```

### OKLCH Color Space
Modern color definitions using OKLCH for better perceptual uniformity:

```css
/* More perceptually uniform color mixing */
--primary-color: oklch(0.6 0.15 250);
--primary-hover: oklch(0.55 0.15 250);
```

### CSS Custom Properties with Fallbacks
Robust variable definitions with fallback support:

```css
background-color: var(--layout-background-0, light-dark(#ffffff, #2a2a2e));
```

## Priority Areas for Styling Updates

Based on the comprehensive analysis, these areas should be prioritized for styling updates:

### 1. **Critical Priority**
- **Message card backgrounds and borders** - Most visible user-facing elements
- **Button styling consistency** - Core interaction elements
- **Text color hierarchy** - Accessibility and readability
- **Focus states and keyboard navigation** - Accessibility compliance

### 2. **High Priority**
- **Hover and active states** - Interactive feedback
- **Icon color consistency** - Visual coherence
- **Semantic color implementation** - Status communication
- **Border and spacing standardization** - Visual consistency

### 3. **Medium Priority**
- **Shadow depth hierarchy** - Visual depth and hierarchy
- **Typography scale implementation** - Content hierarchy
- **Animation and transition consistency** - Smooth interactions
- **Responsive icon sizing** - Multi-context support

### 4. **Low Priority**
- **Advanced color space support** - Future-proofing
- **System accent color integration** - Platform integration
- **Micro-interactions and polish** - Enhanced user experience
- **Performance optimizations** - CSS efficiency

## Resources

### Official Documentation
- [Mozilla CSS Extensions](https://developer.mozilla.org/en-US/docs/Web/CSS/Mozilla_Extensions)
- [Thunderbird Add-on Development](https://developer.thunderbird.net/add-ons)

### CSS Functions and Properties
- [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) - Theme-aware color function
- [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) - Color mixing for state variations
- [`-moz-context-properties`](https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-context-properties) - Icon context properties
- [`oklch()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) - Modern color space

### Thunderbird-Specific
- Use browser developer tools to inspect native Thunderbird UI elements
- Check `chrome://messenger/content/` for native styling examples
- Test in both light and dark themes
- Verify with different system accent colors
- Analyze `chrome://messenger/skin/` for icon and styling resources

### Testing Checklist
- [ ] Test in light theme
- [ ] Test in dark theme
- [ ] Test with different system accent colors
- [ ] Test keyboard navigation (focus states)
- [ ] Test with reduced motion preference
- [ ] Verify icon rendering with fill/stroke
- [ ] Check button group borders
- [ ] Validate hover/active states
- [ ] Test semantic color variations
- [ ] Verify shadow depth hierarchy
- [ ] Check responsive icon sizing
- [ ] Validate modern CSS feature support

---

*This guide is based on comprehensive research and practical experience implementing native Thunderbird styling. The variable reference and implementation recommendations are derived from extensive analysis of Thunderbird's CSS system and successful integration patterns. Keep it updated as new patterns and variables are discovered.*