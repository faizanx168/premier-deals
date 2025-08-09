import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Font loading utility to handle Google Fonts connection issues
export function getFontVariables() {
  try {
    // Check if fonts are loaded successfully
    const geistSansLoaded = typeof window !== 'undefined' ? 
      document.fonts.check('1em Geist Sans') : true;
    const geistMonoLoaded = typeof window !== 'undefined' ? 
      document.fonts.check('1em Geist Mono') : true;

    return {
      geistSans: geistSansLoaded ? 'var(--font-geist-sans)' : 'system-ui, Arial, sans-serif',
      geistMono: geistMonoLoaded ? 'var(--font-geist-mono)' : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace'
    };
  } catch (error) {
    console.warn('Font loading error:', error);
    return {
      geistSans: 'system-ui, Arial, sans-serif',
      geistMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace'
    };
  }
} 