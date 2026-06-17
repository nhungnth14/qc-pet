---
name: QC Pet
colors:
  surface: '#fff8f1'
  surface-dim: '#dfd9d1'
  surface-bright: '#fff8f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3eb'
  surface-container: '#f4ede5'
  surface-container-high: '#eee7df'
  surface-container-highest: '#e8e1da'
  on-surface: '#1e1b17'
  on-surface-variant: '#434751'
  inverse-surface: '#33302b'
  inverse-on-surface: '#f7f0e8'
  outline: '#737782'
  outline-variant: '#c3c6d2'
  surface-tint: '#365da2'
  primary: '#002f6b'
  on-primary: '#ffffff'
  primary-container: '#1a468a'
  on-primary-container: '#93b6ff'
  inverse-primary: '#adc6ff'
  secondary: '#006b5d'
  on-secondary: '#ffffff'
  secondary-container: '#5bf7dd'
  on-secondary-container: '#006f61'
  tertiary: '#472c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#654000'
  on-tertiary-container: '#f6a624'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#184589'
  secondary-fixed: '#5ffae0'
  secondary-fixed-dim: '#38ddc4'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#005046'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb955'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#fff8f1'
  on-background: '#1e1b17'
  surface-variant: '#e8e1da'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 18px
  currency-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
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
  container-margin: 16px
  gutter: 12px
  ui-bar-height: 64px
  chip-padding-x: 12px
  chip-padding-y: 8px
---

## Brand & Style
The design system is built for a vibrant, tactile mobile pet simulation. The brand personality is optimistic, cozy, and playful, drawing heavy inspiration from "kawaii" aesthetics and toy design. The target audience seeks a comforting, low-stress experience.

The visual style is **Hand-Drawn Neo-Brutalist**. It combines a 2D flat illustration style with heavy, consistent 3px black outlines on every interactive and structural element. This creates a "sticker" or "coloring book" effect that feels approachable and physical. Lighting is handled exclusively through **cel-shading**, using single, solid-color highlight blobs (no gradients) to imply volume and sheen, reinforcing the toy-like, chunky quality of the UI.

## Colors
The palette is warm and energetic. The primary Deep Navy (#1A468A) acts as the anchor for structural UI bars and primary text, providing high contrast against the Warm Beige (#FFF8F0) background. 

Functional colors are distinct: Teal and Amber denote separate currencies, while Coral marks streaks and active engagement. Room environments use a softer, pastel-adjacent palette to differentiate "living spaces" from the utility UI. 

**Application Rules:**
- All colored elements must be wrapped in a #000000 3px outline.
- Highlights should be a lighter tint of the base color, applied as a single, rounded blob (approx 20% opacity white or a lighter hex variant).
- Use 40% desaturation on the locked state to visually "recede" elements into the background.

## Typography
This design system utilizes **Plus Jakarta Sans** for its friendly, rounded terminals and high legibility at chunky weights. 

The type hierarchy is "Bold-First." Almost all UI text uses ExtraBold (800) or Bold (700) weights to match the visual weight of the 3px outlines. Numbers in the currency chips and labels should feel integrated into the shapes. For mobile accessibility, the minimum font size for interactive labels is 14px.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous safe margins (16px) to accommodate chunky, hand-drawn assets. 

**Isometric Room View:**
Rooms are rendered in a dollhouse isometric style with a fixed 30-degree angle and "cut-away" front walls. Floor tiles are arranged on a diamond grid.

**UI Layering:**
- **Top Bar:** Fixed height container (64px) holding currency chips.
- **Floating Controls:** Elements like the "Room Label" float at the bottom center or top-left, using heavy shadows to separate from the isometric world.
- **Padding:** Internal element padding is generous to maintain the "toy" feel.

## Elevation & Depth
Depth is created through **Layer Stacking** and **Hard Shadows**, rather than realistic lighting.

- **Level 0 (World):** Isometric rooms and floor tiles.
- **Level 1 (UI Surfaces):** Buttons and chips. These use a 4px offset "hard shadow" (solid black or a darker tint of the background color) to appear "pressed out" of the screen.
- **Attention State:** When an item requires focus, apply a 4px Amber (#F5A623) outer rim glow behind the black outline.
- **Locked State:** Elements are flattened, desaturated to 40%, and the black outline is changed to a dark grey.

## Shapes
Shapes are organic and "squishy." Avoid perfect squares; use high corner radii (16px to 24px) for all containers. 

The 3px black outline is the most critical rule—it must follow the contour of the rounded corners perfectly. For circular elements (like currency icons), the outline remains 3px.

## Components

**Buttons**
- Must have a 3px black outline.
- Use a "pressed" state where the 4px bottom shadow disappears, and the button shifts down by 2px.
- Highlight: A small, white, semi-transparent oval in the top-left corner.

**Currency Chips**
- Pill-shaped containers with Deep Navy or Teal backgrounds.
- Left-aligned circular icon with its own 3px border.
- White ExtraBold text for numbers.

**Room Labels**
- White background, 3px black outline, 16px corner radius.
- Deep Navy text, centered.
- Positioned floating above the room content.

**Isometric Tiles**
- Diamond-shaped floor units.
- Side faces of the floor "slab" should be a slightly darker shade than the top face to indicate thickness.

**Input Fields & Modals**
- Thick 3px borders.
- Modal backdrops should be a solid color with 60% opacity (Deep Navy), not a blur.
- Close buttons (X) are always circular and Coral-colored.