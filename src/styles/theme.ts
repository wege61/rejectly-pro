export const theme = {
    colors: {
      // Primary
      primary: '#6366f1', // indigo-500
      primaryHover: '#4f46e5', // indigo-600
      primaryLight: '#eef2ff', // indigo-50
      
      // Neutral
      background: '#ffffff',
      backgroundAlt: '#f9fafb', // gray-50
      surface: '#ffffff',
      surfaceHover: '#f3f4f6', // gray-100
      
      // Text
      textPrimary: '#111827', // gray-900
      textSecondary: '#6b7280', // gray-500
      textTertiary: '#9ca3af', // gray-400
      
      // Borders
      border: '#e5e7eb', // gray-200
      borderHover: '#d1d5db', // gray-300
      
      // Status
      success: '#10b981', // green-500
      successLight: '#d1fae5', // green-100
      warning: '#f59e0b', // amber-500
      warningLight: '#fef3c7', // amber-100
      error: '#ef4444', // red-500
      errorLight: '#fee2e2', // red-100
      info: '#3b82f6', // blue-500
      infoLight: '#dbeafe', // blue-100
    },
    
    spacing: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
      '3xl': '4rem',   // 64px
    },
    
    typography: {
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      },
      fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    
    radius: {
      sm: '0.25rem',  // 4px
      md: '0.5rem',   // 8px
      lg: '0.75rem',  // 12px
      xl: '1rem',     // 16px
      full: '9999px',
    },
    
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modalBackdrop: 1040,
      modal: 1050,
      popover: 1060,
      tooltip: 1070,
    },
    
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    transitions: {
      fast: '150ms ease',
      normal: '250ms ease',
      slow: '350ms ease',
    },
  };
  
  export type Theme = typeof theme;