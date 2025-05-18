import { ThemeSeasons } from "@app/slices/definitions";

export type seasonalCssVariable =
  "cancel" |
  "confirm" |
  "dark" |
  "light" |
  "primary" |
  "accentBg" |
  "secondary" ;
export const seasonalPaletteConfig: Record<seasonalCssVariable, Record<ThemeSeasons, string>> = {
  primary: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#f2c94e",
    winter: "#ffff"
  },
  secondary: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#8f7c30",
    winter: "#0e8bb5"
  },
   accentBg: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#51400ba3",
    winter: "#4c5054"
  },
  cancel: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#f47d1d",
    winter: "#ea4c89"
  },
  confirm: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#85c370",
    winter: "#b6ebff"
  },
  dark: {
    default: "#000",
    fall: "#000",
    spring: "#2a3c2b",
    summer: "#000000",
    winter: "#0e2232"
  },
  light: {
    default: "#000",
    fall: "#000",
    spring: "#2a3c2b",
    summer: "#faeecb",
    winter: "#f3f5f7"
  }
};