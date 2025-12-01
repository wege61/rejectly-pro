# Required Image Assets for SEO

These image files are referenced in the metadata but currently missing. Please create them and place them in the `/public` directory.

## Critical Assets (High Priority)

### 1. Open Graph Image
- **File:** `og-image.png`
- **Size:** 1200x630 pixels
- **Purpose:** Shows when site is shared on social media (Facebook, Twitter, LinkedIn)
- **Content:** Your logo + tagline "AI Resume Optimizer | Get 3x More Interviews"
- **Tool:** Use Canva, Figma, or https://www.opengraph.xyz/

### 2. Favicon Files
- **favicon.ico** - 32x32 pixels (browser tab icon)
- **favicon-16x16.png** - 16x16 pixels
- **favicon-32x32.png** - 32x32 pixels
- **apple-touch-icon.png** - 180x180 pixels (iOS home screen)
- **Tool:** Use https://realfavicongenerator.net/ (upload one 512x512 PNG, get all sizes)

### 3. PWA Icons (for site.webmanifest)
- **android-chrome-192x192.png** - 192x192 pixels
- **android-chrome-512x512.png** - 512x512 pixels
- **Tool:** Same as favicon generator above

### 4. Logo for Schema
- **logo.png** - 512x512 pixels (square, transparent background)
- **Purpose:** Used in Google Knowledge Graph and structured data
- **Content:** Your company logo only, no text

### 5. Screenshot for Schema
- **screenshot.png** - 1280x720 pixels or larger
- **Purpose:** Shows in Google search results for SoftwareApplication schema
- **Content:** Screenshot of your app dashboard or main feature

## Optional Assets (Medium Priority)

### 6. PWA Screenshots
- **screenshot-mobile.png** - 390x844 pixels (iPhone 14 size)
- **screenshot-desktop.png** - 1920x1080 pixels
- **Purpose:** Shows in PWA installation prompts

### 7. Shortcut Icons (for PWA shortcuts)
- **icon-analyze.png** - 96x96 pixels
- **icon-dashboard.png** - 96x96 pixels

## Quick Setup Guide

### Option 1: Use Favicon Generator (RECOMMENDED)
1. Go to https://realfavicongenerator.net/
2. Upload a 512x512 PNG of your logo
3. Download the generated package
4. Extract and copy all files to `/public` folder
5. This will create most favicon files automatically

### Option 2: Use Canva Templates
1. **OG Image:** Use Canva's "Facebook Post" template (1200x630)
2. **Logo:** Use Canva's "Logo" template (500x500, export as PNG with transparent background)
3. **Screenshots:** Take screenshots of your app and resize

### Option 3: Temporary Placeholder
Currently there's a **favicon.svg** placeholder file created with a purple "R" logo.
You can use this temporarily, but please replace with professional assets before launch.

## Current Status
✅ favicon.svg - Created (temporary placeholder)
❌ og-image.png - **MISSING**
❌ favicon.ico - **MISSING**
❌ favicon-16x16.png - **MISSING**
❌ favicon-32x32.png - **MISSING**
❌ apple-touch-icon.png - **MISSING**
❌ android-chrome-192x192.png - **MISSING**
❌ android-chrome-512x512.png - **MISSING**
❌ logo.png - **MISSING**
❌ screenshot.png - **MISSING**

## After Creating Assets

Once you've created these files, test them:
1. Run `npm run build` to ensure no errors
2. Deploy to production
3. Test with:
   - https://www.opengraph.xyz/ (OG image preview)
   - https://cards-dev.twitter.com/validator (Twitter card)
   - https://search.google.com/test/rich-results (Structured data)

---

**Need help?** You can hire a designer on Fiverr for $5-15 to create all these assets professionally.
