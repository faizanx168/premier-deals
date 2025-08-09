import localFont from 'next/font/local'

// Local font fallback for when Google Fonts fails
export const geistSansLocal = localFont({
  src: [
    {
      path: '../../public/fonts/GeistVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans-local',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

export const geistMonoLocal = localFont({
  src: [
    {
      path: '../../public/fonts/GeistMonoVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono-local',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
})

// Font loading detection utility
export function useLocalFonts() {
  // This can be used to conditionally load local fonts
  // when Google Fonts fails to load
  return {
    geistSans: geistSansLocal,
    geistMono: geistMonoLocal,
  }
} 