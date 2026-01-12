import React from "react";
import { Box } from "@mui/material";
// @ts-ignore
import styled from "styled-components";
import { ThemeSelectIcon } from "utils/assets/icons";
import { useZDispatch, useZSelector } from "app/hooks";
import { ThemeState, ThemeSeasons } from "types";
import { switchThemeAction } from "app/slices/theme";

const ThemeSelector = () => {
  const { season } = useZSelector<ThemeState>(state => state.theme);
  const dispatch = useZDispatch();

  function toggleTheme() {
    switch (season) {
      case ThemeSeasons.summer:
        dispatch(switchThemeAction(ThemeSeasons.winter));
        break;
      case ThemeSeasons.winter:
        dispatch(switchThemeAction(ThemeSeasons.default));
        break;
      default:
        dispatch(switchThemeAction(ThemeSeasons.summer));
        break;
    }
  }

  return (
    <Box position="relative" sx={{ cursor: 'pointer'}}>
      <ThemeIcon link onClick={toggleTheme} tooltip={{ active: true, text: 'Change theme' }} />
    </Box>
  );
}

const ThemeIcon = styled(ThemeSelectIcon)`
  cursor: pointer;
  &:hover {
    box-shadow:1px 1px 4px 0px grey';
  }
`;

export default ThemeSelector;