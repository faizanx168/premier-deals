# Font Files for Local Fallback

This directory contains local font files as a fallback when Google Fonts fails to load.

## Required Font Files

To use local fonts as a fallback, download these files and place them in this directory:

1. **GeistVF.woff2** - Geist Sans Variable Font
2. **GeistMonoVF.woff2** - Geist Mono Variable Font

## Download Instructions

### Option 1: Download from Vercel (Recommended)
1. Visit: https://vercel.com/font
2. Download the Geist font family
3. Extract the `.woff2` files to this directory

### Option 2: Download from Google Fonts
1. Visit: https://fonts.google.com/specimen/Geist+Sans
2. Download the font files
3. Convert to `.woff2` format if needed

### Option 3: Use System Fonts (Fallback)
If you can't download the fonts, the application will automatically fall back to system fonts:
- Sans-serif: system-ui, Arial, Helvetica
- Monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New

## File Structure
```
public/fonts/
├── GeistVF.woff2          # Geist Sans Variable Font
├── GeistMonoVF.woff2      # Geist Mono Variable Font
└── README.md              # This file
```

## Usage
The fonts are automatically loaded as a fallback when Google Fonts fails to load. No additional configuration is needed. 