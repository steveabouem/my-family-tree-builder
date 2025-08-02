declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      primary: string;
      secondary: string;
      error: string;
      warning: string;
      success: string;
      info: string;
      text: string;
    }
  }
}
// allow configuration using `createTheme`
interface ThemeOptions {
  palette: {
    primary: {
      [key: string]: string;
    },
    secondary: {
      [key: string]: string;
    },
    error: {
      [key: string]: string;
    },
    warning: {
      [key: string]: string;
    },
    success: {
      [key: string]: string;
    },
    info: {
      [key: string]: string;
    }
  }
}

// We need to tell TypeScript that when we write "import styles from './styles.scss' we mean to load a module (to look for a './styles.scss.d.ts'). 
declare module '*.scss';
declare module "*.jpg";
declare module "*.png";
declare module "*.po";
declare module "*.js";
declare module 'uuid';
declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}