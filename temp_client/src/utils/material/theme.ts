import { capitalize, createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { Background } from "@xyflow/react";
import { seasonalPaletteConfig, ThemeSeasons } from "types";

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
    primary: { main: seasonalPaletteConfig.primary[season], dark: seasonalPaletteConfig.dark[season], contrastText: seasonalPaletteConfig.accentBg[season] },
    secondary: { main: seasonalPaletteConfig.light[season], dark: seasonalPaletteConfig.secondary[season], contrastText: seasonalPaletteConfig.dark[season] },
    error: { main: seasonalPaletteConfig.cancel[season] },
    text: { primary: seasonalPaletteConfig.dark[season], secondary: seasonalPaletteConfig.secondary[season] },
    // use for text color, inc buttons
    action: {
      hover: seasonalPaletteConfig.pillBg[season],
      selected: '',
      disabled: '',
      disabledBackground: '',
    },
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
      color: seasonalPaletteConfig.secondary[season],
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
      color: seasonalPaletteConfig.pillBg[season],
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
      color: seasonalPaletteConfig.secondary[season],
      textTransform: 'capitalize'
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
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
          height: '35px',
          border: '1px solid',
          borderRadius: '5px',
          input: {
            borderRadius: '5px',
            width: '100%',
            border: 'none'
          }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          width: '100%',
          li: {
            borderRadius: '5px', width: '100%'
          }
        }
      }
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          color: theme.palette.secondary.light,
          background: theme.palette.secondary.dark,
          borderRadius: '5px'
        })
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: '.8s',
          background: theme.palette.primary.main,
          height: "100vh",
          overflow: "hidden",
          borderRadius: '5px'
        })
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: '.8s',
          background: theme.palette.secondary.main,
          borderRadius: '5px'
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: '.8s',
          // background: theme.palette.secondary.main,
          padding: '1rem',
          display: "flex",
          gap: '1rem',
          border: `.8px solid ${theme.palette.text.primary}`,
          borderRadius: '5px'
        })
      }
    },
    MuiModal: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: '.8s',
          borderRadius: '5px',
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
          borderRadius: '5px',
          transition: '.8s',
          fontSize: '.65rem!important',
          boxShadow: 'none!important',
          '&:hover': {
            boxShadow: '1px 1px 4px 0px grey !important'
          },
          '&.MuiButton-colorPrimary': {
            color: theme.palette.primary.dark,
            background: theme.palette.primary.main,
            '&.MuiButton-outlined': {
              background: 'transparent'
            }
          },
          '&.MuiButton-colorSecondary': {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light,
            '&.MuiButton-outlined': {
              background: 'transparent',
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              }
            }
          },
        })
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: '.8s',
          background: 'white',
          borderRadius: '5px',
          height: '35px',
        })
      }
    }
  }
});

export default theme;

