import React, { ReactNode, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { Box, useTheme } from "@mui/material";
// @ts-ignore
import styled from "styled-components";
import { useZDispatch, useZSelector } from "app/hooks";
import { LanguageEnum, LanguageState } from "types";
import { LanguageIcon } from "utils/assets/icons";
import { switchLangAction } from "app/slices/lang";
import { Link } from "react-router-dom";
import BoxColumn from "./containers/row/BoxColumn";
import { menuStyles } from "./menus/hamburgerMenu/Hamburger";

const LanguageSelector = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { current } = useZSelector<LanguageState>(state => state.language);
  const dispatch = useZDispatch();
  const theme = useTheme();

  const menuOptions: { label: ReactNode, value: LanguageEnum }[] = [
    { label: <Trans>french</Trans>, value: LanguageEnum.french },
    { label: <Trans>english</Trans>, value: LanguageEnum.english },
    { label: <Trans>bafia</Trans>, value: LanguageEnum.bafia },
  ];
  const LanguageMenu = styled(Box)`
    position: relative;
    height: 20px;
    max-height: 20px;
  `;
  const LanguageLink = styled(Box) <{ active: boolean }>`
    cursor: pointer;
    text-decoration: none;
    color: ${theme.palette.secondary.dark};
    &:hover {
        text-decoration: underline;
    }
  `;

  function toggleLang(ln: LanguageEnum) {
    dispatch(switchLangAction(ln));
  }

  return (
    <LanguageMenu>
      <LanguageIcon 
        link 
        onClick={() => setIsOpened(!isOpened)} 
        tooltip={{ active: true, text: 'Select language' }}
      />
      {isOpened && <BoxColumn sx={{ ...menuStyles, background: theme.palette.secondary.light }}>
        {menuOptions.map((l, i) => (
          <LanguageLink onClick={() => toggleLang(l.value)} key={`language-selection-${i}`}>
            {l.label}
          </LanguageLink>
        ))}
      </BoxColumn>}
    </LanguageMenu>
  );
};

export default LanguageSelector;