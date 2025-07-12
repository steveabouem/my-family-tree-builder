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
const theme = (season: ThemeSeasons) => createTheme({
  cssVariables: true,
  palette: {
    primary: { main: seasonalPaletteConfig.primary[season], dark: seasonalPaletteConfig.dark[season], contrastText: seasonalPaletteConfig.secondary[season] },
    secondary: { main: seasonalPaletteConfig.light[season], dark: seasonalPaletteConfig.secondary[season], contrastText: seasonalPaletteConfig.dark[season] },
    error: { main: seasonalPaletteConfig.cancel[season] },
    text: { primary: seasonalPaletteConfig.dark[season] },
    // warning: {main: seasonalPaletteConfig.[season]}
    // info: {main: seasonalPaletteConfig.cancel[season]}
    grey: { "400": seasonalPaletteConfig.accentBg[season] }, // used for tree layout bg, to contrast w bg image
    // action: {main: seasonalPaletteConfig.cancel[season]}
    success: { main: seasonalPaletteConfig.confirm[season], contrastText: seasonalPaletteConfig.dark[season] },
    background: {
      default: seasonalPaletteConfig.primary[season],
      paper: seasonalPaletteConfig.light[season]
    },
    info: {
      main: seasonalPaletteConfig.pillBg[season],
      contrastText: seasonalPaletteConfig.pillBgInverse[season]
    }
  },
  typography: {
    h1: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "2rem",
      color: seasonalPaletteConfig.dark[season],
      padding: ".8rem 0"
    },
    h2: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.5rem",
      color: seasonalPaletteConfig.secondary[season],
      padding: ".8rem 0"
    },
    h3: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.2rem",
      color: seasonalPaletteConfig.secondary[season],
      padding: ".8rem 0"
    },
    h4: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: "1.1rem",
      color: seasonalPaletteConfig.dark[season],
      padding: ".8rem 0"
    },
    body1: {
      ...defaultTypo,
      color: seasonalPaletteConfig.dark[season],
    },
    body2: {
      ...defaultTypo,
      fontSize: ".88rem",
      color: seasonalPaletteConfig.dark[season],
    },
    subtitle2: { // label
      ...defaultTypo,
      fontSize: ".9rem",
      color: seasonalPaletteConfig.secondary[season]
    },
    caption: {
      ...defaultTypo,
      fontSize: '.6rem',
      color: seasonalPaletteConfig.light[season]
    },
    subtitle1: {
      ...defaultTypo,
      textTransform: "capitalize",
      color: seasonalPaletteConfig.dark[season],
      fontSize: '.9rem'
    },
    h6: {
      ...defaultTypo,
      textTransform: "capitalize",
      fontSize: '.9rem',
      color: seasonalPaletteConfig.secondary[season],
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
          background: theme.palette.primary.main,
          height: "100vh",
          overflow: "hidden"
        })
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.secondary.main,
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          // background: theme.palette.secondary.main,
          padding: '1rem',
          display: "flex",
          gap: '1rem',
          border: `.8px solid ${theme.palette.text.primary}`
        })
      }
    },
    MuiModal: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiBox-root': {
            background: theme.palette.background.paper,
            '&.info': {
              h3: {
                color: theme.palette.info.main
              },
            },
            '&.success': {
              h3: {
                color: theme.palette.success.main
              },
            },
            '&.warning': {
              color: theme.palette.warning.main,
            },
            '&.error': {
              background: theme.palette.error.light,
            },
          },
        })
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '.65rem!important',
          transition: '.8s',
        })
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: 'white'
        })
      }
    }
  }
});

export default theme;

