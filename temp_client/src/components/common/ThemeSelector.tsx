import React from "react";
import { Box, useTheme } from "@mui/material";
import styled from "styled-components";
import { Trans } from "@lingui/macro";
import { ThemeSelectIcon } from "utils/assets/icons";
import { useZDispatch, useZSelector } from "app/hooks";
import { ThemeState, ThemeSeasons } from "types";
import { switchThemeAction } from "app/slices/theme";

const ThemeSelector = () => {
  const { season } = useZSelector<ThemeState>(state => state.theme);
  const dispatch = useZDispatch();
  const theme = useTheme();

  function toggleTheme() {
    switch (season) {
      case ThemeSeasons.sunny:
        dispatch(switchThemeAction(ThemeSeasons.winter));
        break;
      case ThemeSeasons.winter:
        dispatch(switchThemeAction(ThemeSeasons.default));
        break;
      default:
        dispatch(switchThemeAction(ThemeSeasons.sunny));
        break;
    }
  }

  return (
    <Box position="relative" sx={{ cursor: 'pointer'}}>
      <ThemeIcon color={theme.palette.primary.dark} link onClick={toggleTheme} tooltip={<Trans>change theme</Trans>} />
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