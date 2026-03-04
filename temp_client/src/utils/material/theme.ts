import { createTheme } from "@mui/material";
import { seasonalPaletteConfig, ThemeSeasons } from "types";

const defaultTypo = {
  fontSize: ".9rem",
};
function genBG(s: ThemeSeasons) {
  switch (s) {
    case ThemeSeasons.winter:
      return 'linear-gradient(70deg, rgb(244 253 255 / 85%) 39%, rgb(255 255 255) 69%, rgb(205 253 255 / 32%) 100%)';
    case ThemeSeasons.sunny:
      return 'linear-gradient(70deg, rgb(255 236 160 / 85%) 39%, rgb(255 204 0 / 88%) 69%, rgb(255 149 4 / 46%) 100%)';
    default:
      return 'linear-gradient(70deg, rgb(2 11 26) 56%, rgb(78 47 183 / 92%) 75%, rgb(95 6 59) 103%)';
  }
}

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
      paper: seasonalPaletteConfig.primary[season]
    },
    info: {
      main: seasonalPaletteConfig.pillBg[season],
      contrastText: seasonalPaletteConfig.pillBgInverse[season]
    }
  },
  typography: {
    fontFamily: [
      'Dosis',
      'Gruppo',
      'Lato',
      'Montserrat Alternates',
    ].join(','),
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
      color: seasonalPaletteConfig.dark[season],
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
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '1rem',
          color: `${theme.palette.primary.contrastText}`,
        })
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: '100%',
          height: '35px',
          borderRadius: '5px',
          color: `${theme.palette.primary.contrastText}`,
          input: {
            color: `${theme.palette.primary.contrastText}`,
            borderRadius: '5px',
            padding: '1rem',
            border: '1px solid',
            width: '100%',
            height: '100%',
          }
        })
      }
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          background: `${theme.palette.info.contrastText}`,
          padding: 0
        })
      }
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: '100%',
          background: `${theme.palette.info.contrastText}!important`,
          'MuiBox-root': {
            padding: '0 .5rem'
          },
          li: {
            // borderRadius: '5px', width: '100%',
            color: `${theme.palette.secondary.contrastText}`
          }
        })
      }
    },
    MuiCollapse: {
      styleOverrides: {
        wrapperInner: ({ theme }) => ({
          padding: '1rem .5rem',
        })
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
          background: genBG(season),
          backgroundSize: '100%'
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
          '&.Mui-disabled': {
            color: '#e3e3e3!important',
            background: 'grey!important'
          },
          /* PRIMARY BUTTONS */
          '&.MuiButton-colorPrimary': {
            '&.MuiButton-contained': {
              color: theme.palette.primary.main,
              background: theme.palette.primary.dark,
              '&:hover': {
                background: theme.palette.primary.main,
                color: theme.palette.primary.dark,
              },
            },
            '&.MuiButton-outlined': {
              background: 'transparent',
              color: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark,
              '&:hover': {
                color: theme.palette.secondary.dark,
              },
            },
            '&.MuiButton-text': {
              background: 'transparent',
              color: theme.palette.secondary.dark,
              border: 'none',
              '&:hover': {
                border: 'none',
                boxShadow: 'none!important',
                color: theme.palette.primary.dark,
              }
            }
          },
          /* SECONDARY BUTTONS */
          '&.MuiButton-colorSecondary': {
            '&.MuiButton-contained': {
              color: theme.palette.primary.main,
              background: theme.palette.info.main,
              '&:hover': {
                background: theme.palette.primary.main,
                color: theme.palette.info.main,
              },
            },
            '&.MuiButton-outlined': {
              color: theme.palette.info.main,
              borderColor: theme.palette.info.main,
              background: 'transparent',
              '&:hover': {
                color: theme.palette.info.main,
              },
            },
            '&.MuiButton-text': {
              background: 'transparent',
              color: theme.palette.info.main,
              border: 'none',
              '&:hover': {
                boxShadow: 'none!important',
                color: theme.palette.primary.dark,
              }
            }
          },/* SUCCESS BUTTONS */
          '&.MuiButton-colorSuccess': {
            '&.MuiButton-contained': {
              color: theme.palette.primary.contrastText,
              background: theme.palette.success.main,
              '&:hover': {
                color: 'white'
              },
            },
            '&.MuiButton-outlined': {
              background: 'transparent',
              borderColor: theme.palette.success.main,
              color: theme.palette.success.main,
            },
          },
          '&.MuiRadio-root': {
            '&.Mui-checked': {
              color: theme.palette.secondary.dark,
              borderColor: theme.palette.secondary.dark,
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
          border: '1px solid',
          '&.MuiInputBase': {
            padding: '1rem',
          }
        }),
      }
    }
  }
});

export default theme;
