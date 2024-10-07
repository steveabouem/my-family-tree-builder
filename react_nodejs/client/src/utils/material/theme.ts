import { createTheme } from "@mui/material";

const defaultTypo = {
  fontSize: "1rem",
  color: "#5d576b"
};

const theme = createTheme({
  palette: {
    background: {
      default: '#FFFFF6'
    },
    primary: {
      main: "#5d576b", //dark purple
      light: "#e6ebe0", // light green
    },
    secondary: {
      main: "#7498b4", // blue
      dark: "#041a46", // dark blue
      light: "#FFFFF6", // white
    },
    info: {
      main: "#fff"
    },
    grey: {
      "400": "#cecaca3d",
      "100": "#8f97a0"
    },
    error: {
      main: "#ff9b71"
    },
    success: {
      main: "#5b9279",
      light: "#f4f1bb"
    },
  },
  typography: {
    h1: {
      ...defaultTypo,
      fontSize: "2rem",
      color: "#041a46"
    },
    h2: {
      ...defaultTypo,
      fontSize: "1.5rem",
      color: "#041a46"
    },
    h3: {
      ...defaultTypo,
      fontSize: "1.2rem",
      color: "#041a46"
    },
    body1: {
      ...defaultTypo
    },
    body2: {
      ...defaultTypo,
      fontSize: ".88rem",
    },
    subtitle2: {
      ...defaultTypo,
      fontSize: ".9rem",
      color: "#5b9279"
    },
    caption: {
      ...defaultTypo,
      fontSize: '.6rem'
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.secondary.light,
          height: "100vh",
          overflow: "hidden"
        })
      }
    },
    MuiModal: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiBox-root': {
            background: theme.palette.primary.light,
          }
        })
      }
    }
  }
});

export default theme;

// palette options:
// 2
// dark: #2C363F,
// red/pink: e75a7c
// lighter green: f2f5ea
// light green: d6dbd2
// olive green: BBC7A4



