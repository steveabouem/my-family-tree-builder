import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { AutumnIcon, FlowerIcon, SnowmanIcon, SunIcon, ThemeSelectIcon } from "utils/assets/icons";
import { useZDispatch, useZSelector } from "app/hooks";
import { DThemeState, ThemeSeasons } from "app/slices/definitions";
import { switchThemeAction } from "app/slices/theme";

const ThemeSelector = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const { season } = useZSelector<DThemeState>(state => state.theme);
  const dispatch = useZDispatch();

  return (
    <Box position="relative" >
      <ThemeSelectIcon size={20} onClick={() => setOpened(!opened)} sx={{ cursor: 'pointer' }} />
      {opened && (
        <Box display="flex" flexDirection="column" gap={1} position="absolute" right="0" p={1} top="35px" width="60px" sx={{background: 'white', borderRadius: '100px'}}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={0}>
              {/* <Typography variant="body1"><Trans>spring</Trans></Typography> */}
              <FlowerIcon size={15} onClick={() => dispatch(switchThemeAction(ThemeSeasons.spring))} sx={{ cursor: 'pointer', borderRadius: '50px', background: '#1b573d',color: '#aceecc' }} />
            </Box>
            <Box display="flex" gap={0}>
              {/* <Typography variant="body1"><Trans>summer</Trans></Typography> */}
              <SunIcon size={15} onClick={() => dispatch(switchThemeAction(ThemeSeasons.summer))} sx={{ cursor: 'pointer', borderRadius: '50px', background: '#ffe289',color: '#8a7b3a' }} />
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={0}>
              {/* <Typography variant="body1"><Trans>fall</Trans></Typography> */}
              <AutumnIcon size={15} onClick={() => dispatch(switchThemeAction(ThemeSeasons.fall))} sx={{ cursor: 'pointer', borderRadius: '50px', background: '#f9c391',color: '#c0731b' }} />
            </Box>
            <Box display="flex" gap={0}>
              {/* <Typography variant="body1"><Trans>winter</Trans></Typography> */}
              <SnowmanIcon size={15} onClick={() => dispatch(switchThemeAction(ThemeSeasons.winter))} sx={{ cursor: 'pointer', borderRadius: '50px', background: '#26444d',color: '#edfbff' }} />
            </Box>
          </Box>
          <Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ThemeSelector;