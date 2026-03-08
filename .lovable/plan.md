

## Issues Found

### 1. App.css causing alignment problems
`App.css` has a `#root` rule that sets `max-width: 1280px`, `margin: 0 auto`, `padding: 2rem`, and `text-align: center`. This is a leftover from the Vite template and is interfering with the full-width layout of the app -- constraining content width and adding unwanted padding.

### 2. Hero section lacks a distinct background behind the title/headline
The hero currently uses a subtle gradient (`from-blue-50 via-white to-blue-50`) which blends into the page. The title and subtitle need a more visible, contained background element to make them stand out.

## Plan

### Step 1: Clean up App.css
Remove the `#root` styles that constrain layout. This fixes alignment issues across the entire app by allowing sections to be full-width.

### Step 2: Add a frosted-glass/card background behind hero title and headline
Wrap the hero title (`h1`) and subtitle (`p`) in a container with a semi-transparent background, backdrop blur, rounded corners, and padding. This creates a visible "panel" behind the text content:
- Light mode: `bg-white/60 backdrop-blur-sm`
- Dark mode: `dark:bg-gray-800/60`
- Rounded corners, padding, and subtle shadow

### Files to modify
- **`src/App.css`** -- Remove the `#root` block and other unused Vite template styles
- **`src/pages/Index.tsx`** -- Add a background container behind the hero title and subtitle text

