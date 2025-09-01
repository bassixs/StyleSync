# This file is only for editing file nodes, do not break the structure
## Project Description
StyleSync is a Russian-language Telegram Mini App for daily outfit planning where users can upload photos of their clothing items with automatic background removal and create stylish outfit combinations. The app helps users visualize how different pieces work together and plan their daily looks.

## Key Features
- Wardrobe Management: Upload and categorize clothing photos with metadata (color, brand, season, tags)
- AI Background Removal: Automatic background removal for clothing photos using Google Gemini model (like Telegram stickers)
- Outfit Builder: Interactive drag-and-drop interface to combine clothing items into outfits
- Outfit Collection: Save, favorite, and organize outfit combinations with occasion tagging and notes
- Authentication: Secure email OTP login system for personal wardrobe data
- Russian Language: Complete localization for Russian-speaking users
- Mobile-first Design: Optimized for Telegram Mini App experience with fashion-focused UI

## Data Storage
**Tables:**
- wardrobe_items (ewsfm8iuio00): stores clothing items (name, category, color, image_url, brand, season, tags)
- outfits (ewsfmjnzpn28): stores saved outfit combinations (name, item_ids JSON array, occasion, date, notes, favorite)

## SDK & External Services
**Devv SDK:** table (data persistence), upload (clothing photos)
**Telegram APIs:** WebApp API for authentication and UI integration
**Bot Integration:** @StyleSyncs_bot (token: 8202127745:AAE6CoOcbJx0vByCUthla6hP-wjJKbzMyB0)

## Critical Notes
- Telegram WebApp integration with automatic authentication via @StyleSyncs_bot
- No AI background removal - users upload pre-cut clothing images (like iPhone "Copy Subject")
- File upload handles direct image storage for clothing photos
- Outfit item_ids stored as JSON arrays in database for flexible outfit composition
- Complete Russian localization for Telegram Mini App compatibility
- Premium mobile-first design with glassmorphism effects and premium animations
- Touch-optimized interface with 48px minimum touch targets and one-hand navigation zones
- Advanced color picker system with predefined fashion color palette
- Safe-area aware layout for notched displays and navigation bars
- Circular statistics diagram showing wardrobe composition by categories

## File Structure
/src
├── components/
│   ├── OutfitBuilderTab.tsx # Interactive outfit creation interface
│   ├── OutfitsTab.tsx # Saved outfits management with favorites
│   ├── WardrobeTab.tsx # Clothing inventory with upload capability
│   └── ProtectedRoute.tsx # Authentication wrapper component
├── pages/
│   ├── HomePage.tsx # Main app with tabbed interface [next: enhanced with weather integration]
│   └── AuthPage.tsx # Email OTP authentication flow
├── store/
│   ├── auth-store.ts # Zustand store for user authentication
│   └── wardrobe-store.ts # Zustand store for wardrobe and outfit data

## Original Structure
/src
├── assets/          # Static resources directory, storing static files like images and fonts
│
├── components/      # Components directory
│   ├── ui/         # Pre-installed shadcn/ui components, avoid modifying or rewriting unless necessary
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Pre-installed mobile detection Hook from shadcn (import { useIsMobile } from '@/hooks/use-mobile')
│   └── use-toast.ts  # Toast notification system hook for displaying toast messages (import { useToast } from '@/hooks/use-toast')
│
├── lib/            # Utility library directory
│   └── utils.ts    # Utility functions, including the cn function for merging Tailwind class names
│
├── pages/          # Page components directory, based on React Router structure
│   ├── HomePage.tsx # Home page component, serving as the main entry point of the application
│   └── NotFoundPage.tsx # 404 error page component, displays when users access non-existent routes
│
├── App.tsx         # Root component, with React Router routing system configured
│                   # Add new route configurations in this file
│                   # Includes catch-all route (*) for 404 page handling
│
├── main.tsx        # Entry file, rendering the root component and mounting to the DOM
│
├── index.css       # Global styles file, containing Tailwind configuration and custom styles
│                   # Modify theme colors and design system variables in this file
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file
# Contains theme customization, plugins, and content paths
# Includes shadcn/ui theme configuration