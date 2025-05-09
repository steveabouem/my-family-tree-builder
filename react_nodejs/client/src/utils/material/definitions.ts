import { ThemeSeasons } from "@app/slices/definitions";

export type seasonalCssVariable =
  'bgDefault' | 'primaryMain' | 'primaryLight' | 'secondaryMain' | 'secondaryLight' | 'errorMain' | 'errorLight' | 'successMain' | 'successLight' | 'secondaryDark' | 'buttonPrimary' |
  'buttonSecondary' | 'infoMain' | 'warningMain'| 'warningLight' | 'grey400' | 'grey100';
export const seasonalPaletteConfig: Record<seasonalCssVariable, Record<ThemeSeasons, string>> = {
  bgDefault: {
    default: "#FFFFF6",
    spring: "#dce394",
    summer: "#ffe347",
    fall: "#000",
    winter: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(193, 222, 228, 1) 32%, rgba(177, 225, 227, 1) 59%, rgba(80, 209, 229, 1) 95%)"
  },
  primaryMain: {
    default: "#5d576b",
    spring: "#dce394",
    summer: "#ffe347",
    fall: "#000",
    winter: "#000"
  },
  primaryLight: {
    default: "#e6ebe0",
    spring: "#dce394",
    summer: "#ffe347",
    fall: "#000",
    winter: "#000"
  },
  secondaryMain: {
    default: "#7498b4",
    spring: "#dce394",
    summer: "#ffe347",
    fall: "#000",
    winter: "#000"
  },
  secondaryLight: {
    default: "#e6ebe0",
    spring: "#dce394",
    summer: "#ffe347",
    fall: "#000",
    winter: "#000"
  },
  secondaryDark: {
    default: "#041a46",
    spring: "#dce394",
    summer: "#ffe347",
    fall: "#000",
    winter: "#000"
  },
  buttonPrimary: { //button color
    spring: "#e8fff4",
    summer: "f4c84e",
    default: "#000",
    fall: "#000",
    winter: "#000"

  },
  buttonSecondary: { // button bg
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#000",
    fall: "#000",
    winter: "#000"
  },
  infoMain: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#fff",
    fall: "#000",
    winter: "#000"

  },
  warningMain: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#fff",
    fall: "#000",
    winter: "#000"

  },
  warningLight: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#fff0b6",
    fall: "#000",
    winter: "#000"

  },
  grey400: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#cecaca3d",
    fall: "#000",
    winter: "#000"

  },
  grey100: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#8f97a0",
    fall: "#000",
    winter: "#000"

  },
  errorMain: {
    spring: "#ff9b71",
    summer: "#0a0000",
    default: "#8f97a0",
    fall: "#000",
    winter: "#000"

  },
  errorLight: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#ffd8c7",
    fall: "#000",
    winter: "#000"

  },
  successMain: {
    spring: "#ff9b71",
    summer: "#0a0000",
    default: "#5b9279",
    fall: "#000",
    winter: "#000"

  },
  successLight: {
    spring: "#2a3c2b",
    summer: "#0a0000",
    default: "#f4f1bb",
    fall: "#000",
    winter: "#000"

  }
};