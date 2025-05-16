import { ThemeSeasons } from "@app/slices/definitions";

export type seasonalCssVariable =
  "cancel" | // error
  "confirm" | // success
  "dark" | // text
  "light" | // secondary text
  "primary" |  // main bg
  "accentBg" |// bg overlay  color
  "secondary"; // section bg 
export const seasonalPaletteConfig: Record<seasonalCssVariable, Record<ThemeSeasons, string>> = {
  primary: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#f2c94e",
    winter: "#000"
  },
  secondary: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#8f7c30",
    winter: "#000"
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
    winter: "#000"
  },
  confirm: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#85c370",
    winter: "#000"
  },
  dark: {
    default: "#000",
    fall: "#000",
    spring: "#2a3c2b",
    summer: "#000000",
    winter: "#000"
  },
  light: {
    default: "#000",
    fall: "#000",
    spring: "#2a3c2b",
    summer: "#faeecb",
    winter: "#000"
  }
};