import { capitalize, createTheme } from "@mui/material";
import { white } from "material-ui/styles/colors";

const defaultTypo = {
  fontSize: ".9rem",
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
    warning: {
      main: "#fff",
      light: "#fff0b6"
    },
    grey: {
      "400": "#cecaca3d",
      "100": "#8f97a0"
    },
    error: {
      main: "#ff9b71",
      light: "#ffd8c7",
    },
    success: {
      main: "#5b9279",
      light: "#f4f1bb"
    },
  },
  typography: {
    h1: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "2rem",
      color: "#041a46",
      padding: ".8rem 0"
    },
    h2: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.5rem",
      color: "#041a46",
      padding: ".8rem 0"
    },
    h3: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.2rem",
      color: "#041a46",
      padding: ".8rem 0"
    },
    h4: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.1rem",
      color: "#041a46",
      padding: ".8rem 0"
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
    },
    subtitle1: { // USE FOR LABELS
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: '.9rem'
    },
    button: { // USE FOR LABELS
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: '.8rem',
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
            '&.info': {
              background: theme.palette.info.main,
              p: {
                color: theme.palette.primary.main
              }
            },
            '&.success': {
              background: theme.palette.success.light,
              p: {
                color: theme.palette.success.main
              }
            },
            '&.warning': {
              background: theme.palette.warning.light,
              color: theme.palette.warning.main,
            },
            '&.error': {
              background: theme.palette.error.light,
            },
          }
        })
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '.65rem!important',
          transition: '.8s',
          '&:hover': {
            boxShadow: "1px -1px 2px 0px #5d576b!important",
            transform: "translate(2px -2px)"
          }
        })
      }
    },
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



