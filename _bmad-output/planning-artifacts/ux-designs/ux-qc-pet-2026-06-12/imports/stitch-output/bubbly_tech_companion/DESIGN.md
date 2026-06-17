---
name: Bubbly Tech Companion
colors:
  surface: '#f9f9ff'
  surface-dim: '#cbdaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#001a41'
  on-surface-variant: '#3e4851'
  inverse-surface: '#002e69'
  inverse-on-surface: '#edf0ff'
  outline: '#6e7882'
  outline-variant: '#bdc8d2'
  surface-tint: '#006491'
  primary: '#006491'
  on-primary: '#ffffff'
  primary-container: '#22b5ff'
  on-primary-container: '#004464'
  inverse-primary: '#8aceff'
  secondary: '#944839'
  on-secondary: '#ffffff'
  secondary-container: '#fd9d89'
  on-secondary-container: '#773224'
  tertiary: '#674bb5'
  on-tertiary: '#ffffff'
  tertiary-container: '#b59cff'
  on-tertiary-container: '#472894'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#8aceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004b6f'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3d0701'
  on-secondary-fixed-variant: '#773124'
  tertiary-fixed: '#e8ddff'
  tertiary-fixed-dim: '#cebdff'
  on-tertiary-fixed: '#21005e'
  on-tertiary-fixed-variant: '#4f319c'
  background: '#f9f9ff'
  on-background: '#001a41'
  surface-variant: '#d8e2ff'
typography:
  display:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 40px
  header-lg:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  ui-button:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  container-padding: 20px
---

## Brand & Style
The design system centers on a "Cuteness-Driven Development" philosophy. It merges the tactile, squishy aesthetic of modern 3D virtual pets with a playful "junior tester" tech theme. The UI is designed to feel soft and inviting, mirroring the fluffy roundness of the lead character, Bugsy.

The visual style is a hybrid of **Tactile/Skeuomorphic** and **High-Contrast Bold**. Elements feature thick outlines, inner glows, and soft 3D-shading to give them a "pop-off-the-screen" toy-like quality. To ground the experience in its testing/tech narrative, retro pixel-art motifs are used sparingly for terminal screens or code-related data, creating a charming contrast between the soft organic character and the structured digital world.

## Colors
The palette is vibrant and saturated, designed to maintain high energy. 
- **Sky Blue (#22B5FF)** is the action color, used for primary interactions to evoke a sense of clarity and "mission start."
- **Warm Peach (#FF9E8A)** serves as the primary environmental background, creating a cozy, non-intimidating "office" atmosphere.
- **Deep Navy (#1A468A)** is used for all text and thick borders to ensure maximum legibility and a comic-book-like definition.
- **Warm White (#FFF8F6)** is used for cards and panels, providing a soft "paper-like" surface that feels cleaner than pure white.
- **Lime Green and Amber** are reserved for positive feedback loops (XP gain, currency), providing a rewarding visual pop.

## Typography
The system uses **Nunito Sans** for its extremely rounded terminals and friendly proportions, mirroring the "Bubbly" design language. 

- **Display & Headers:** Should always be rendered in Bold/Black weights. Headers feature a subtle 2px drop-shadow in a darker shade of the font color or a very soft outer glow to simulate 3D depth.
- **Body Text:** Uses Medium or Semi-Bold weights to maintain presence against the vibrant background colors.
- **Code Accents:** A secondary monospaced font (**JetBrains Mono**) is used for "Bugsy's Terminal" or bug reports, emphasizing the tech-office theme.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous safe areas to prevent the UI from feeling cramped. 

- **Vertical Rhythm:** A base-8 spacing scale is used, but margins between major card components are kept wide (24px+) to allow the environmental background to peek through, reinforcing the "office" setting.
- **Safe Areas:** Significant bottom padding is reserved for the primary interaction dock.
- **Mobile Reflow:** On mobile devices, panels should occupy 90-95% of the screen width to maximize the "bubbly" tactile surface area.

## Elevation & Depth
Depth is not achieved through traditional realistic shadows, but through **Tonal Stacking** and **Thick Outlines**.

- **Level 0 (Background):** Solid Warm Peach or Sky Blue.
- **Level 1 (Cards):** Warm White surface with a 3px Deep Navy border. Features a "blocky" drop shadow (0px offset X, 6px offset Y) with 100% opacity in a darker tone of the background.
- **Level 2 (Active Buttons):** Primary Sky Blue with an inner top-highlight (lighter blue) and a bottom-weighted dark blue shadow to create a "pressed" or "squishy" look.
- **Overlays:** Bubbly speech bubbles use a 4px Deep Navy border and a tiny triangular tail, always appearing at the highest elevation.

## Shapes
Everything in this design system is rounded. 

- **Containers:** Use a consistent **24px (rounded-xl)** radius to mimic the soft, fluffy edges of the characters.
- **Buttons:** Use **Pill-shaped** (fully rounded) geometry to make them feel like "toy" buttons.
- **Icons:** Icons must have rounded caps and corners. They are enclosed in circular or rounded-square containers with thick 3px outlines. 
- **Speech Bubbles:** Use an irregular, slightly "wobbly" roundedness to feel organic and hand-drawn.

## Components
- **Buttons:** Large, pill-shaped, and high-contrast. The primary action button (Sky Blue) should have a slight "bounce" animation on press. Use white text with a Navy outline for maximum punch.
- **Cards:** These are "Panels." They must have a 3px solid Navy border. The header area of a card often has a secondary color background (e.g., Soft Purple) with the title centered.
- **Progress Bars (XP/Energy):** Thick containers with rounded ends. The fill color is Lime Green, and the empty state is a darker version of the panel background. Feature a "shimmer" effect on the fill.
- **Chips/Badges:** Used for "Bug Tags" (e.g., "Critical", "Fixed"). These use the Pixel-art font and sharp-edged containers to contrast with the soft UI.
- **The "Terminal" Input:** A specific input field for "Code missions" that uses a dark navy background, lime green pixel text, and a blinking underscore cursor.
- **Currency Toggles:** Small rounded pills showing Amber (Gold) or Teal (Credits) with a 3D icon of the coin/gem partially overlapping the left edge.