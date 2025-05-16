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