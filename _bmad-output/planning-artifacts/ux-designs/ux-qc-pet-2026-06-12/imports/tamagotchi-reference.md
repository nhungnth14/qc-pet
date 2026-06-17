# Virtual Pet App — Design Specification

## 1. App Overview
- **Core concept and gameplay loop:** A vibrant 3D mobile virtual pet simulator inspired by Tamagotchi where players hatch eggs, care for their pet's basic needs (happiness, hunger, hygiene, sleep), and explore a lively world. The gameplay loop centers on monitoring the pet's vital stats, performing care actions (petting, feeding, bathing, putting to bed), earning currency through progression maps and mini-games, and purchasing yard decorations like soccer fields to unlock unique dialogue and evolution paths.
- **Platform:** mobile (iOS/Android)
- **Total screens identified:** 7 distinct screens/states

## 2. Visual Design System

### Color Palette
| Role | Color Name | Hex Approximation |
|------|-----------|-------------------|
| Background (Indoor) | Coral Sparkle | #FF9E8A |
| Background (Outdoor) | Sky Blue | #7AD7FF |
| Primary UI | Sky Blue Button | #22B5FF |
| Text | Deep Navy | #1A468A |
| Accent | Lime Green | #8EE500 |
| Warning/Low stat | Alert Red | #FF4B4B |

### Typography
- **Display/Pet name:** 32pt, Bold, White with Blue Outline, Rounded Sans-Serif
- **Stat labels:** 16pt, Bold, Dark Blue, Rounded Sans-Serif
- **Body/Menu:** 14pt, Medium, Dark Blue/White, Rounded Sans-Serif

### Visual Style
- **UI aesthetic:** Cute, modern, high-contrast 3D cartoon style with rounded corners and bubbly speech bubbles, paired with retro pixel-art motifs for collection menus.
- **Icon style:** Thick-outlined, colorful 3D-shaded vector icons.
- **Animation style:** Smooth 3D character idle and action animations, mixed with bouncy UI pop-ups and particle bursts during unlocking sequences.

## 3. Screen Specifications

### Screen: Age Verification
**Purpose:** Collects the user's birth year to ensure age-appropriate compliance upon initial setup.
**Layout:** Centralized vertical scroll wheel container set against a patterned purple background, with a fixed button at the bottom.
**Components:**
- **Year Scroller:** Vertical wheel highlighting the selected year flanked by up and down arrow buttons.
- **Confirm Button:** Bright green call-to-action button placed at the lower center.
**User Actions:**
- Tap Up/Down Arrows → Scroll through birth years.
- Tap Confirm Button → Save year data and advance to Egg Hatching.
**Navigation links:** Egg Hatching Screen.

### Screen: Egg Hatching
**Purpose:** Introducing the player's first pet egg and initiating the hatching sequence.
**Layout:** Centralized egg model sitting on an indoor rug with a helper avatar floating in the upper left corner.
**Components:**
- **Pet Egg:** A 3D cream-colored egg with pink horizontal wavy stripes sitting on a pink target rug.
- **Helper Avatar (Mametchi):** Floating guide head pointing a hand down at the egg to prompt player interaction.
**User Actions:**
- Tap Pet Egg → Initiates hatching animation sequence.
**Navigation links:** Baby Unlock Screen.

### Screen: Baby Unlock
**Purpose:** Celebrates the hatching of a new baby Tamagotchi and updates the player's collection ledger.
**Layout:** Grid of unlockable baby silhouettes at the top half, large celebratory text in the center, and the 3D baby pet centered on the floor below.
**Components:**
- **Babies Ledger:** A horizontal grid of white square frames showing unlocked pixel icons and locked slots.
- **Unlock Announcement:** Large stylized text displaying "You have unlocked Futabatchi" with pink starburst particles.
- **Futabatchi Model:** Yellow round 3D baby pet with a double-leaf sprout on its head, smiling on the pink rug.
**User Actions:**
- Tap Screen → Dismisses unlock celebration and opens the Indoor Main Care Room.
**Navigation links:** Indoor Main Care Room.

### Screen: Indoor Main Care Room (Petting State)
**Purpose:** The primary hub for checking the pet's happiness and interacting directly with it via touch.
**Layout:** Large central space showcasing the 3D pet, a persistent level indicator in the top-left, a lower-left contextual status bar, and a bottom row of care shortcuts.
**Components:**
- **Level Indicator:** Blue circle badge displaying the pet's current level (e.g., Level 1 or 2) with a green circular progress ring.
- **Speech Bubble:** Contextual guide bubble reading "Petting me increases my happiness. Swipe the screen over me to pet me!".
- **Happiness Tracker:** Lower-left square button showing a face icon, a percentage status (e.g., 50%), and a red downward trend arrow.
- **Care Action Dock:** Grid of blue rounded buttons along the bottom for core needs (Happiness, Food, Toilet, Sleep).
**User Actions:**
- Swipe over Pet Model → Triggers petting animation and increases happiness percentage.
- Tap Care Action Buttons → Toggles relevant care overlays or rooms.
**Navigation links:** Bathroom Screen, Bedroom Screen, Town Map Screen.

### Screen: Bathroom (Hygiene State)
**Purpose:** Cleans the pet when it becomes dirty or after it creates a mess.
**Layout:** Indoor bathroom with pink patterned wallpaper, a central character bathtub, and a top-facing interactive shower head.
**Components:**
- **Duck Bathtub:** A whimsical white 3D tub shaped like a duck where the pet sits covered in soap suds.
- **Shower Head:** Interactive blue fixture with a pointing hand icon guiding the player.
- **Instructional Text:** Centered prompt reading "Use the shower to rinse all the bubbles."
- **Currency Display:** Top bar tracking available Gems (Pink) and Gotchi Points (Gold).
**User Actions:**
- Drag Shower Head → Moves water stream over the pet to clear bubbles and maximize hygiene stats.
**Navigation links:** Indoor Main Care Room.

### Screen: Bedroom (Sleep State)
**Purpose:** Replenishes the pet's energy bars by letting it rest during night cycles or low-energy periods.
**Layout:** Dimly lit attic room featuring a wooden bed frame, a nightstand with a glowing lamp, and the care dock at the base.
**Components:**
- **Bed:** Yellow wooden bed frame with a blue cloud-patterned blanket where the pet lies with closed eyes.
- **Sleep Action Button:** Highlighted red-bordered button in the dock displaying a crescent moon and stars.
**User Actions:**
- Tap Sleep Action Button → Toggles bedroom lights on/off to wake or rest the pet.
**Navigation links:** Indoor Main Care Room.

### Screen: Town Map Progression
**Purpose:** A linear level-select trail where players track milestones and claim gift rewards.
**Layout:** A winding S-shaped stone path traveling vertically through an outdoor park environment, populated by numbered stepping stones.
**Components:**
- **Milestone Steps:** Numbered blue and yellow circular stepping stones (1 through 11+).
- **Player Marker:** A blue square speech-style badge holding a silhouette, pinning the user's current level position.
- **Gift Boxes:** Decorative present items resting next to specific nodes (e.g., nodes 3, 4, 5, 6, 7, 8, 10) representing unlockable milestone rewards.
**User Actions:**
- Tap Active Path Node → Opens mini-game or completes map object.
**Navigation links:** Yard Customization Screen, Indoor Main Care Room.

### Screen: Yard Customization (Soccer Field Example)
**Purpose:** Allows players to spend currency to purchase interactive furniture and environmental themes for their pet's outdoor yard.
**Layout:** Split screen featuring an outdoor view of the house/trampoline area at the top, an expandable vertical category sidebar on the left, and a large placement preview area below.
**Components:**
- **Yard View:** 3D environment displaying the pet's house, white fences, and pre-placed items like a trampoline.
- **Category Sidebar:** Vertical menu with blue square icons categorizing yard items (Fences, Flora, Bridges, Benches, Shops, Lighting).
- **Item Placement Preview:** Displays a "Soccer Field" item overlay complete with a goal net and boundary chalk markings.
- **Purchase Bar:** A pink button container at the bottom showing the item cost (e.g., 750 Gotchi Points) underneath a directional hand prompt.
**User Actions:**
- Tap Sidebar Category → Filters available yard items.
- Tap Purchase Button → Deducts currency, unlocks the object, and places it permanently in the yard.
**Navigation links:** Indoor Main Care Room, Town Map Progression.

---

## 4. Pet Stats & Game Mechanics

### Stats Table
| Stat | Display Type | Range | Passive Change | Player Action |
|------|-------------|-------|---------------|---------------|
| Happiness | progress bar | 0–100% | -5% per 15 mins | Swipe over pet to pet / buy toys |
| Hunger | progress bar | 4 Stages | Drops 1 unit/hr | Select food item from Kitchen |
| Hygiene | progress bar | Clean/Dirty | Soil trigger after feeding | Drag shower head over pet |
| Energy / Sleep | progress bar | 0–100% | -8% per hour awake | Turn off bedroom lights |

### Core Game Loop
The player needs to monitor the pet's dropping vitals (Happiness, Hunger, Hygiene, and Energy) continuously. Performing core care activities rewards the player with progression milestones and currency (Gems/Gotchi Points). The earned points are then fed back into unlocking maps and purchasing custom items (like a soccer field), which in turn modifies the pet's interaction layers and triggers evolutionary phase transitions.

### Actions Reference
| Action | UI Element | Stats Affected | Constraints |
|--------|-----------|---------------|-------------|
| Feed | Kitchen menu item selection | Hunger restored | Cooldown per snack |
| Petting | Direct Screen Swipe | Happiness +10% | None |
| Bathing | Shower Drag | Hygiene Reset to 100% | Only active when pet or room is dirty |
| Sleeping | Moon Care Button | Energy +25% per hour | Locks room interactions while active |
| Yard Purchase| Gold Price Tag Button| Happiness Max Cap +5 | Requires sufficient Gotchi Gold Points |

---

## 5. Navigation Flow

```
[Age Verification]
       │
       ▼
 [Egg Hatching]
       │
       ▼
 [Baby Unlock]
       │
       ▼
 ┌─────────────────────── [Indoor Main Care Room] ◄──────────────────────────────┐
 │                             │▲                │▲                              │
 ▼                             ││                ││                              ▼
[Bathroom (Hygiene)] ◄─────────┘│                │└────────► [Bedroom (Sleep)] ◄─┤
                                ▼                ▼                               │
                   [Town Map Progression] ◄──► [Yard Customization] ─────────────┘
```
