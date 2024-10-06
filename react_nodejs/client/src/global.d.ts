declare module '@mui/material/styles' {
  interface Theme {
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
      }
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
    }
  }
}