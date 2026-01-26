# INAS Homepage Redesign - Walkthrough

## Overview
We have remodeled the INAS homepage with a modern **3D Gradient / Claymorphism** aesthetic, inspired by premium educational platforms (SENA/Betowa). The design features vibrant colors, rounded glass cards, and high-quality 3D assets.

## Visual Verification
### AI Assistant (New)
The site now features a **Smart Chatbot** powered by Google Gemini.
- **Location**: Bottom-right floating action button.
- **Capabilities**: Answers questions about payments, uniforms, schedule, and location.
- **Context**: Aware of INAS institutional details (Mission, Vision, Banks).

### Hero Section
The "Storefront" of the school.
- **Gradient Background**: Deep Purple to Cyan transition.
- **3D Hero**: Custom generated 3D student character.
- **Floating UI**: Glass-effect search bar and navbar.

![Hero Section View](C:/Users/USER/.gemini/antigravity/brain/d4d96b90-eab5-42d5-98c0-9afe4a9e26fa/initial_viewport_1768928143061.png)

### Services Section
The "Quick Links" area.
- **3D Icons**: Custom generated clay icons for each service.
- **Glass Cards**: Semi-transparent white cards with hover lift effects.
- **Color Coding**: Each card has a distinct accent color (Cyan, Purple, Orange, Red, Blue).

![Services Grid View](C:/Users/USER/.gemini/antigravity/brain/d4d96b90-eab5-42d5-98c0-9afe4a9e26fa/services_section_1768928182862.png)

### Community Section (New Adaption)
Adapted from the original collage photo.
- **Glass Frame**: The original collage is presented inside a tilted glass-frame for a modern look.
- **Floating Decorations**: Added floating 3D-style emojis (Heart, Palette, Books) via CSS animation.

### Excellence & Results Section (Timeline)
Replicated the ICFES results timeline in the new style.
- **Horizontal Scroll**: Responsive scrolling container for all years (2021-2025).
- **Result Cards**: Clean cards with "Promedio" and ranking details.
- **Trend Indicators**: Badges with Up/Down arrows indicating progress.

![Results Timeline View](C:/Users/USER/.gemini/antigravity/brain/d4d96b90-eab5-42d5-98c0-9afe4a9e26fa/resultados_icfes_section_1768930898004.png)

### Uniforms Section (New)
Showcasing the school uniforms with 3D Pixar-style characters.
- **Sudadera**: Student couple in PE Tracksuit.
- **Diario**: 3D Students in formal grey/blue uniforms.
- **Decoration**: Background colored circles for depth.
- **Spacing**: Verified title visibility.

![Uniforms Section View](C:/Users/USER/.gemini/antigravity/brain/d4d96b90-eab5-42d5-98c0-9afe4a9e26fa/uniforms_section_verification_1768933043947.png)

## Files Created
- `index.html`: The main entry point (embeddable).
- `styles.css`: All styling variables and animations.
- `assets/`: Folder containing all generated 3D images and the user's photo.

## How to Test
1.  **Run Locally (Recommended)**:
    - Open a terminal in the project folder.
    - Run `npx vite` (or `npm run dev`).
    - Open the local URL (usually `http://localhost:5173` or `http://localhost:3000`).
2.  **Static File**:
    - Open the `index.html` file directly in any modern browser.
3.  Scroll through all sections to see animations and hover effects.
4.  **Mobile Test**:
    - Resize browser to mobile width.
    - Click the hamburger icon to open the navigation drawer.

## Mobile Navigation (Refined)
Implemented a premium **Floating Glass Drawer** for mobile users.
- **Glassmorphism**: High-quality blur and transparency (`backdrop-filter: blur(25px)`).
- **Floating Panel**: Rounded corners and reduced width (280px) for a non-intrusive experience.
- **Interactive Links**: Links turn into colorful "pills" on interaction.
- **Smooth Animation**: Bouncy slide-in effect.

## Desktop Navigation (Refined)
Enhanced the header links with a **"Glass Pill"** hover effect.
- **Visuals**: Links transform into semi-transparent, rounded pills on hover.
- **Effect**: Includes background blur (`backdrop-filter`) and a subtle lift (`transform: translateY`).

## Payment Information (Redesigned)
The **Pagos** page now fully matches the site's premium aesthetic.
- **Glass Cards**: Bank cards feature `backdrop-filter: blur(10px)`, semi-transparent gradients, and an interactive "Shine" overlay on hover.
- **Glass Panel Information**: The payment instructions are now presented in a centered, floating glass panel with clear typography and consistent icons.
- **Visuals**: Enhanced shadows and hover lift effects match the homepage's specific design language.

