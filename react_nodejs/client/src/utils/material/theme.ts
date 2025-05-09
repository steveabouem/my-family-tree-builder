import { capitalize, createTheme } from "@mui/material";
import { seasonalPaletteConfig } from "./definitions";
import { ThemeSeasons } from "@app/slices/definitions";

const defaultTypo = {
  fontSize: ".9rem",
};

/*
* Theme are following the seasons. the config object maps the color codes to the key names used in the palette values below
* in turn, the MUI components configured here use those dynamic palette values to define the compnents color palette
*/
const theme = (season: ThemeSeasons) =>  createTheme({
  palette: {
    background: {
      default: seasonalPaletteConfig.bgDefault[season]
    },
    primary: {
      main: seasonalPaletteConfig.primaryMain[season],
      light: seasonalPaletteConfig.primaryLight[season],
    },
    secondary: {
      main: seasonalPaletteConfig.secondaryMain[season],
      dark: seasonalPaletteConfig.secondaryDark[season],
      light: seasonalPaletteConfig.bgDefault[season],
    },
    info: {
      main: seasonalPaletteConfig.infoMain[season]
    },
    warning: {
      main: seasonalPaletteConfig.warningMain[season],
      light: seasonalPaletteConfig.warningLight[season]
    },
    grey: {
      "400": seasonalPaletteConfig.grey400[season],
      "100": seasonalPaletteConfig.grey100[season]
    },
    error: {
      main: seasonalPaletteConfig.errorMain[season],
      light: seasonalPaletteConfig.errorLight[season]
    },
    success: {
      main: seasonalPaletteConfig.successMain[season],
      light:  seasonalPaletteConfig.successLight[season],
    },
  },
  typography: {
    h1: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "2rem",
      color: seasonalPaletteConfig.secondaryDark[season],
      padding: ".8rem 0"
    },
    h2: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.5rem",
      color: seasonalPaletteConfig.secondaryDark[season],
      padding: ".8rem 0"
    },
    h3: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.2rem",
      color: seasonalPaletteConfig.secondaryDark[season],
      padding: ".8rem 0"
    },
    h4: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.1rem",
      color: seasonalPaletteConfig.secondaryDark[season],
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
      color: seasonalPaletteConfig.successMain[season]
    },
    caption: {
      ...defaultTypo,
      fontSize: '.6rem'
    },
    subtitle1: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: '.9rem'
    },
    // @ts-ignore
    label: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: '.9rem'
    },
    button: {
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
            boxShadow: `1px -1px 2px 0px ${seasonalPaletteConfig.successMain[season]}!important`,
            transform: "translate(2px -2px)"
          }
        })
      }
    },
  }
});

export default theme;

