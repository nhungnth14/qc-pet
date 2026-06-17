---
name: QC Pet Design System
colors:
  surface: '#fff8f6'
  surface-dim: '#e6d7d4'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#faeae7'
  surface-container-high: '#f5e5e2'
  surface-container-highest: '#efdfdc'
  on-surface: '#221a18'
  on-surface-variant: '#54433f'
  inverse-surface: '#372e2d'
  inverse-on-surface: '#fdedea'
  outline: '#87726e'
  outline-variant: '#dac1bc'
  surface-tint: '#944839'
  primary: '#944839'
  on-primary: '#ffffff'
  primary-container: '#ff9e8a'
  on-primary-container: '#783325'
  inverse-primary: '#ffb4a5'
  secondary: '#006491'
  on-secondary: '#ffffff'
  secondary-container: '#24b5ff'
  on-secondary-container: '#004464'
  tertiary: '#3f6900'
  on-tertiary: '#ffffff'
  tertiary-container: '#7ecc00'
  on-tertiary-container: '#2f5100'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3d0701'
  on-primary-fixed-variant: '#773124'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#8aceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004b6f'
  tertiary-fixed: '#a1fa29'
  tertiary-fixed-dim: '#89dc00'
  on-tertiary-fixed: '#102000'
  on-tertiary-fixed-variant: '#2e4f00'
  background: '#fff8f6'
  on-background: '#221a18'
  surface-variant: '#efdfdc'
typography:
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 40px
    fontWeight: '900'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Nunito Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-lg:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '800'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style
The design system is built to evoke the charm of hand-drawn 2D stationery and "kawaii" character brands. It focuses on a **Flat Illustration** style that prioritizes clarity, warmth, and a high-contrast "sticker" feel.

The aesthetic is heavily influenced by the Sanrio and LINE Friends universes, utilizing thick outlines and a "bubbly" geometry to create a safe, cheerful, and cozy environment for virtual pet interaction. The interface should feel like a tactile toy or a high-quality coloring book, avoiding any digital-first trends like gradients or glassmorphism in favor of solid, vibrant color blocking and cel-shaded depth.

## Colors
The palette is warm and high-energy, using "Warm Peach" as the primary brand anchor. 

- **Primary (Peach):** Used for main interactions and pet-related surfaces.
- **Secondary (Sky Blue):** Used for navigation, water, and calm states.
- **Tertiary (Lime Green):** Reserved for growth, health, and positive reinforcement.
- **Warm Amber:** Used for alerts, highlights, and "special" items or currencies.
- **Deep Navy:** This replaces pure black for all body text to maintain a softer, more "ink-like" feel, though UI outlines remain solid black (#000000).

All interactive elements must maintain a high contrast against the off-white background (#FFF9F5) to ensure the interface feels bright and accessible.

## Typography
The system uses **Nunito Sans** for its inherently rounded terminals and friendly, approachable letterforms. 

- **Weight Strategy:** Headlines should always use 'ExtraBold' (800) or 'Black' (900) weights to stand up against the heavy 3px outlines used in the UI components. 
- **Readability:** Body text uses 'SemiBold' (600) to ensure legibility within speech bubbles and cards, preventing the text from looking too thin compared to the bold illustrative elements.
- **Character:** For large display titles, a slight negative letter-spacing is applied to create a tighter, more "logo-like" feel.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous safe areas. Because this is a character-driven app, whitespace is used to frame the pet and interactive objects like "stickers."

- **The 8px Rhythm:** All spacing and padding must be multiples of 8px to maintain a structured but "chunky" feel.
- **Margins:** On mobile, a 20px margin is enforced to keep interactive elements away from screen edges, creating a "framed" look.
- **Reflow:** On larger screens, the UI doesn't just stretch; it centers the pet's "room" and docks menus to the sides or bottom as floating panels with heavy shadows.

## Elevation & Depth
In this design system, depth is communicated through **Bold Borders** and **Cel-Shading**, rather than realistic shadows.

- **Outlines:** Every container and interactive component must have a solid 3px black (#000000) stroke.
- **Hard Shadows:** Instead of blurs, use a "drop-block" shadow. This is a solid, offset fill (usually 4px down and 4px right) in a darker version of the surface color or a transparent Deep Navy (20% opacity).
- **Highlights:** Apply a secondary, lighter "inner-glow" or "sheen" to the top-left of buttons and speech bubbles. This should be a solid, lighter shape (cel-shaded) rather than a gradient, mimicking the look of a glossy sticker.
- **Z-Axis:** Higher elevation is represented by larger offsets of the hard shadow, making the item appear to "pop" further off the page.

## Shapes
The shape language is strictly **Bubbly and Hyper-Rounded**. 

- **Corners:** Standard UI cards and containers use a 16px to 24px radius.
- **Interactive Elements:** Buttons and chips often use the "Pill" shape (full rounding) to make them look "squishable" and friendly.
- **Speech Bubbles:** These should be organic, slightly irregular rounded rectangles with a 3px outline and a triangular "tail" that is also slightly rounded at the tip. 
- **Negative Space:** Avoid sharp 90-degree angles anywhere in the interface. Even the ends of lines and paths should be set to "Round Cap."

## Components

- **Buttons:** Large, pill-shaped, with a 3px black outline. They feature a solid 4px offset shadow (bottom-right) and a thin white cel-shaded "sheen" on the top curve. On press, the button should shift 2px down and right, and the shadow should shrink.
- **Speech Bubbles:** White backgrounds with Deep Navy text. The 3px outline is mandatory. The "tail" should point clearly to the pet or character speaking.
- **Cards:** Use a 24px corner radius. Cards should have a background color (Peach or Sky Blue) and a "content area" inside that is white with a 16px radius.
- **Chips/Badges:** Small, fully rounded capsules used for pet stats (e.g., "Hungry," "Happy"). Use the Tertiary (Lime Green) color for positive stats.
- **Input Fields:** Thick outlines with a subtle cream background (#FFFDF0) to distinguish them from the main page background. Focus states increase the outline thickness to 4px.
- **Progress Bars:** "Liquid" look. The container is a pill shape with a 3px outline; the fill is a vibrant color (e.g., Lime Green) with a small white highlight dot at the leading edge to make it look like a filling tube of juice.
- **Inventory Slots:** Square containers with 16px rounded corners, featuring a dashed 2px outline when empty and a solid 3px outline when holding an item.