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

## Resources

### Official Documentation
- [Mozilla CSS Extensions](https://developer.mozilla.org/en-US/docs/Web/CSS/Mozilla_Extensions)
- [Thunderbird Add-on Development](https://developer.thunderbird.net/add-ons)

### CSS Functions and Properties
- [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) - Theme-aware color function
- [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) - Color mixing for state variations
- [`-moz-context-properties`](https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-context-properties) - Icon context properties

### Thunderbird-Specific
- Use browser developer tools to inspect native Thunderbird UI elements
- Check `chrome://messenger/content/` for native styling examples
- Test in both light and dark themes
- Verify with different system accent colors

### Testing Checklist
- [ ] Test in light theme
- [ ] Test in dark theme  
- [ ] Test with different system accent colors
- [ ] Test keyboard navigation (focus states)
- [ ] Test with reduced motion preference
- [ ] Verify icon rendering with fill/stroke
- [ ] Check button group borders
- [ ] Validate hover/active states

---

*This guide is based on practical experience implementing Quick Filter styling and other native Thunderbird UI components. Keep it updated as new patterns and variables are discovered.*