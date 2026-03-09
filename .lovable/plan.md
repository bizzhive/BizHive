

# Gen Z Visual Overhaul — Graphics, Motion, and Effects

## What We'll Build

A visually rich, motion-heavy redesign of the homepage and global components targeting Gen Z aesthetics: glassmorphism, animated gradients, SVG illustrations, emoji accents, micro-interactions, and scroll-triggered animations.

## Changes

### 1. Tailwind Config — New Keyframes and Utilities
Add keyframes for: `blob` (morphing background shapes), `shimmer` (text shine), `slide-up`, `glow-pulse`, `spin-slow`, `wiggle`. Add corresponding animation classes.

### 2. CSS (`src/index.css`) — New Effects
- Glassmorphism utility classes (`.glass`, `.glass-dark`)
- Animated gradient text class (`.gradient-text-animated`)
- Glow/neon hover effects (`.neon-glow`)
- Floating blob background shapes (`.blob`)
- Noise texture overlay for depth
- Smooth scroll-triggered reveal via `[data-animate]` with intersection observer pattern

### 3. Homepage (`src/pages/Index.tsx`) — Full Visual Redesign
- **Hero**: Animated gradient mesh background with floating blob SVGs, large gradient text with shimmer effect, emoji accents (🚀 💡 🔥), animated CTA buttons with glow, trusted-by badge strip with logos
- **Quick Tools**: Glassmorphism cards with colored border glow on hover, icon animations (bounce/wiggle), staggered scroll-reveal entrance
- **Features**: Bento-grid layout with varied card sizes, gradient icon backgrounds, hover lift + glow, animated connecting lines between cards
- **Stats**: Animated number counters (keep existing), add particle/sparkle background, gradient text numbers
- **CTA**: Mesh gradient background, floating geometric shapes (circles, hexagons), pulsing glow button
- **New Section — Social Proof / Testimonials**: Scrolling marquee of logos or short quotes for credibility
- **Decorative SVG illustrations**: Rocket, lightbulb, chart-up icons as floating decorative elements using inline SVGs

### 4. Navigation (`src/components/Navigation.tsx`)
- Add glassmorphism backdrop with subtle border glow
- Active link indicator: animated underline slide effect
- Logo hover: subtle wiggle animation

### 5. Footer (`src/components/Footer.tsx`)
- Gradient top border with animated shimmer
- Subtle grid/dot pattern background
- Link hover: color shift with underline slide

## Technical Approach
- All animations via CSS + Tailwind — no extra dependencies needed
- Use `IntersectionObserver` in a small custom hook (`useScrollReveal`) for scroll-triggered animations
- SVG illustrations inline for performance (no external image loads)
- All effects respect `prefers-reduced-motion` media query
- Dark mode fully supported for all new effects

## File Changes
| File | Action |
|------|--------|
| `tailwind.config.ts` | Add keyframes + animation utilities |
| `src/index.css` | Add glassmorphism, glow, blob, gradient-text classes |
| `src/hooks/use-scroll-reveal.ts` | New — IntersectionObserver hook |
| `src/pages/Index.tsx` | Full visual redesign with all effects |
| `src/components/Navigation.tsx` | Glassmorphism + link animations |
| `src/components/Footer.tsx` | Gradient border + pattern background |

