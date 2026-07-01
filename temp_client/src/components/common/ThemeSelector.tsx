import React from "react";
import { Box, useTheme } from "@mui/material";
import styled from "styled-components";
import { Trans } from "@lingui/macro";
import { DarkIcon, LightIcon} from "utils/assets/icons";
import { useZDispatch, useZSelector } from "app/hooks";
import { ThemeState, ThemeSeasons } from "types";
import { switchThemeAction } from "app/slices/theme";

const ThemeSelector = () => {
  const { season } = useZSelector<ThemeState>(state => state.theme);
  const dispatch = useZDispatch();
  const theme = useTheme();
  const isLight = season === ThemeSeasons.winter;

  function toggleTheme() {
    switch (season) {
      case ThemeSeasons.winter:
        dispatch(switchThemeAction(ThemeSeasons.default));
        break;
      default:
        dispatch(switchThemeAction(ThemeSeasons.winter));
        break;
    }
  }

  return (
    <Box position="relative" sx={{ cursor: 'pointer' }}>
      {isLight
        ?
        <Dark color={theme.palette.primary.dark} link onClick={toggleTheme} tooltip={<Trans>light/dark</Trans>} />
        :
        <Light color={theme.palette.primary.dark} link onClick={toggleTheme} tooltip={<Trans>light/dark</Trans>} />
      }
    </Box>
  );
}

const Light = styled(LightIcon)`
  cursor: pointer;
  &:hover {
    box-shadow:1px 1px 4px 0px grey';
  }
`;

const Dark = styled(DarkIcon)`
  cursor: pointer;
  &:hover {
    box-shadow:1px 1px 4px 0px grey';
  }
`;

export default ThemeSelector;