import React, { ReactNode, useState } from "react";
import { Trans } from "@lingui/macro";
import { Box, useTheme } from "@mui/material";
import styled from "styled-components";
import { useZDispatch, useZSelector } from "app/hooks";
import { LanguageEnum, LanguageState } from "types";
import { LanguageIcon } from "utils/assets/icons";
import { switchLangAction } from "app/slices/lang";
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
    height: 100%;
    align-items: flex-end;
    max-height: 20px;
    display: flex;
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
    setIsOpened(false);
  }

  return (
    <LanguageMenu>
      <LanguageIcon 
        link 
        color={theme.palette.primary.dark}
        onClick={() => setIsOpened(!isOpened)} 
        tooltip={<Trans>select_language</Trans>}
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