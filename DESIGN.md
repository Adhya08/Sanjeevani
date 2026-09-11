---
name: Mandi Ledger
colors:
  surface: '#fff9ed'
  surface-dim: '#e0d9ca'
  surface-bright: '#fff9ed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e3'
  surface-container: '#f4eddd'
  surface-container-high: '#efe8d8'
  surface-container-highest: '#e9e2d2'
  on-surface: '#1e1c12'
  on-surface-variant: '#524437'
  inverse-surface: '#333026'
  inverse-on-surface: '#f7f0e0'
  outline: '#847465'
  outline-variant: '#d6c3b1'
  surface-tint: '#865300'
  primary: '#835100'
  on-primary: '#ffffff'
  primary-container: '#a46708'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb962'
  secondary: '#5a6057'
  on-secondary: '#ffffff'
  secondary-container: '#dce2d6'
  on-secondary-container: '#5e645b'
  tertiary: '#964233'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55a49'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb9'
  primary-fixed-dim: '#ffb962'
  on-primary-fixed: '#2b1700'
  on-primary-fixed-variant: '#663e00'
  secondary-fixed: '#dfe4d9'
  secondary-fixed-dim: '#c2c8bd'
  on-secondary-fixed: '#171d16'
  on-secondary-fixed-variant: '#424840'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a6'
  on-tertiary-fixed: '#3f0300'
  on-tertiary-fixed-variant: '#7b2e20'
  background: '#fff9ed'
  on-background: '#1e1c12'
  surface-variant: '#e9e2d2'
typography:
  display:
    fontFamily: IBM Plex Serif
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  display-mobile:
    fontFamily: IBM Plex Serif
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-lg:
    fontFamily: IBM Plex Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.005em
  headline-lg-mobile:
    fontFamily: IBM Plex Serif
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  headline-md:
    fontFamily: IBM Plex Serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  headline-sm:
    fontFamily: IBM Plex Serif
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  data-mono:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-ledger:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  stamp-badge:
    fontFamily: IBM Plex Serif
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
spacing:
  grid-hairline: 1px
  grid-double: 3px
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
  margin-mobile: 0.75rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  gutter-default: 1rem
---

## Brand & Style

This design system is forged for the high-velocity, high-stakes domain of Indian agricultural wholesale markets (*mandis*) and rescue cold-chain logistics. The aesthetic—**Mandi Ledger**—draws directly from physical ledger books (*bahi-khata*), crate stencils, chalkboard rate-boards, and stamped physical provenance receipts.

It targets mandi traders, logistics dispatchers, cold-storage operators, and procurement desks who need immediate, error-free operational clarity under harsh ambient lighting and intense time pressure.

The visual style is:
- **Strictly Flat & Tactile:** Zero drop shadows, zero blurs, zero glassmorphism, zero multi-tone gradients. Depth is established solely through ruled lines, flat tint fills, and structural borders.
- **Utilitarian & Ledger-Dense:** Information architecture prioritizes scannable data density, strict table structures, ledger column rules, and tabular lining numerals over decorative whitespace.
- **Physical Provenance:** Emphasizes stamped seals, physical entry ticks, crate-mark categorizations, and indelible recordkeeping motifs.

## Colors

The palette reproduces the tactile, physical materiality of an agricultural ledger desk: unbleached fibrous paper, rich carbon ink, weathered slate signage, and natural botanical dye indicators.

### Primary Palette
- **Paper (`#EDE6D6`):** The foundational neutral surface. Muted unbleached mill paper. Applied across the canvas, card backgrounds, and operational sheets.
- **Ink (`#2B2620`):** Warm near-black carbon pigment. Used for primary typography, deep structural hairline borders, and critical ledger entries.
- **Slate (`#3A4038`):** Deep chalkboard green-gray. Applied to table headers, dashboard chrome, toolbar rails, and primary data metadata dividers.
- **Turmeric (`#B9791F`):** Rich earthy mustard. Primary accent for high-value actions, pending triage batches, critical selections, and active ledger focus highlights.

### Functional Status Indicators
- **Moss (`#5C6B4F`):** Earthy vegetative green. Signifies fresh produce, safe shelf-life predictions, stable humidity, and verified clearance.
- **Rust (`#8B3A2B`):** Deep iron-oxide red. Signifies critical decay velocity, expired transit windows, broken cold-chains, and immediate rescue dispatch triggers.

### Color Rules
1. Backgrounds never drop below `#EDE6D6` into stark digital `#FFFFFF`.
2. Do not use opacity fades for disabled states; use hatched line-work or solid flat tints (e.g., `#E2D9C5`).
3. Borders and ledger rules strictly utilize `#2B2620` (full contrast) or a 25% tint (`#C8BEAA`) on paper.

## Typography

The type system mirrors historical recordkeeping and mechanical documentation: an authoritative slab serif for headers and stamps, paired with a functional grotesque sans for rapid ledger computation and telemetry readout.

- **Headings & Stamped Artifacts (`IBM Plex Serif`):** Delivers the permanence of hot-metal type and stencil prints. Reserved for lot headings, batch manifests, market names, and audit verifications.
- **Body & Numerical Readouts (`IBM Plex Sans`):** High legibility under field lighting. All numerical tables must use `font-variant-numeric: tabular-nums lining-nums` to guarantee strict vertical decimal alignment across weight, shelf-life, and rupee columns.
- **Micro-labels & Stencils (`label-ledger` / `stamp-badge`):** Styled exclusively in uppercase with expanded tracking (`0.08em`–`0.12em`) to mimic physical wood-block stamps and ledger sub-headers.

## Layout & Spacing

Layouts adhere to an unyielding structural grid reminiscent of physical ruled folio ledgers. Density is favored over sprawling padding.

### Grid & Architecture
- **Desktop (1024px+):** 12-column rigid fluid grid with `1rem` (16px) gutters and `2.5rem` outer margins. Data sheets can switch to full-width dense mode with horizontal rules dividing every entry row.
- **Tablet (768px - 1023px):** 8-column layout with `1.5rem` margins. Side-by-side logistics triage cards collapse to 2-column blocks.
- **Mobile (< 768px):** 4-column layout with `0.75rem` (12px) compact gutters. Information-dense manifests switch to stacked ledger cards separated by solid hairline rules.

### Ledger Rhythms
- Spacing is anchored to a base 4px/8px module.
- Tables and list rows use compact vertical heights: 36px for dense transaction rows, 44px for actionable touch targets on field devices.
- Containers abut with shared borders (`1px solid #2B2620`) to prevent doubled lines, reflecting manual ledger rulings.

## Elevation & Depth

This design system rejects synthetic lighting models entirely:
- **No Shadows:** `box-shadow: none` is enforced across all elements, modals, dropdowns, and flyouts.
- **Structural Elevation:** Hierarchy is achieved solely through **Hairline Borders**, **Tonal Fills**, and **Inverted Contrast**:
  1. **Base Surface (Level 0):** Paper (`#EDE6D6`). The main background.
  2. **Bounded Container (Level 1):** Paper framed by a `1px solid #2B2620` hairline border, or filled with `#E6DECD` for nested ledger sections.
  3. **Header Chrome / Slate Band (Level 2):** Solid Slate (`#3A4038`) fill with contrasting Paper (`#EDE6D6`) text. Used for section anchors, drawer heads, and master table titles.
  4. **Floating Drawers / Modals (Level 3):** Grounded by a solid `2px solid #2B2620` outer border accompanied by a physical hard inset double-rule (`border: 1px solid #2B2620; outline: 1px solid #2B2620; outline-offset: -4px;`), simulating stamped registration lines.

## Shapes

The shape system is strictly **Sharp (0px)**. 

- All buttons, chips, tags, inputs, cards, dialogs, and table cells carry `border-radius: 0px`.
- Rounded corners contradict the physical nature of sawn wooden crates, ledger rules, and printed stencil markings.
- Minor decorative geometry—such as clipped 45-degree chamfered corners on high-priority decay warning tags (`clip-path: polygon(...)`)—may be employed to represent physical punched cargo tags.

## Components

### Buttons
- **Primary Action (Rescue/Dispatch):** Solid Turmeric (`#B9791F`) background, Ink (`#2B2620`) text, `1px solid #2B2620` border. Active state: Invert to Ink background with Paper text.
- **Secondary Action:** Unfilled Paper (`#EDE6D6`) background, `1px solid #2B2620` border, Ink text. Hover: Solid `#DDD3C0` fill.
- **Critical Rescue Action:** Rust (`#8B3A2B`) background, Paper (`#EDE6D6`) text, sharp 0px border.
- **Typography:** IBM Plex Sans, bold, all-caps, `font-size: 13px`, `letter-spacing: 0.05em`.

### Chips & Stencils
- **Crate Stencil Badge:** Monospaced or uppercase IBM Plex Serif, enclosed in a `1px dashed #2B2620` or `1px solid #3A4038` border.
- **Decay Status Chip (Moss / Fresh):** Moss (`#5C6B4F`) flat fill, Paper (`#EDE6D6`) text.
- **Decay Status Chip (Rust / Spoiling):** Rust (`#8B3A2B`) flat fill, Paper (`#EDE6D6`) text.
- No rounded pills; strictly rectilinear rectangular tabs.

### Data Tables (The Mandi Sheet)
- **Header:** Slate (`#3A4038`) background, Paper (`#EDE6D6`) text, IBM Plex Sans, uppercase, 11px, bold.
- **Row Borders:** Bottom border `1px solid #C8BEAA`.
- **Alternating Zebra (Optional):** Alternates between `#EDE6D6` and `#E6DEC8`.
- **Numerical Alignment:** Tabular-nums, right-aligned for quintals, crates, decay hours remaining, and auction values.

### Inputs & Search Bars
- Background: `#FAF7F0` (clean paper tier).
- Border: `1px solid #2B2620`.
- Focus State: `2px solid #B9791F` (no glow rings, no halo offsets).
- Placeholder: `#7D7569` italicized.

### Checkboxes & Radios
- **Checkbox:** Square, `16x16px`, `1px solid #2B2620`. Checked state: Solid Ink fill with a raw sharp-edged checkmark or an "X" drawn from corner to corner.
- **Radio:** Square rotated 45-degrees (diamond) or square with an inner solid square indicator. Avoid curved circles.

### Ledger Cards
- Rectangular surfaces with an explicit top rule: `4px solid #3A4038` (Slate) or `#B9791F` (Turmeric for priority).
- Internal dividers: Hairline `1px solid #2B2620`.
- Metadata displayed in stacked "Key : Value" pairs with dashed underline leaders.

### Specialized Provenance Seal
- Used for verified cold-chain handoffs and lot releases.
- A square, double-bordered box (`2px outer, 1px inner`) stamped with lot ID, inspection timestamp, and inspector signature block in Slate (`#3A4038`) or Rust (`#8B3A2B`).