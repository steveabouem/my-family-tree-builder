import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, useTheme } from "@mui/material";
import logo from "utils/assets/images/logo.jpg";
import PageUrlsEnum from "utils/urls";
import ThemeSelector from "../ThemeSelector";
import { useZSelector } from "app/hooks";
import { UserState } from "types";
import BoxRow from "../containers/column";
import Hamburger from "../menus/hamburgerMenu/Hamburger";
import LanguageSelector from "../LanguageSelector";
import styled from "styled-components";

const TopNav = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const truncatedUserName = currentUser?.firstName?.split('')?.map((s, i) => { if (i > 5) { return '.' } return s })?.join('');

  const StyledNav = styled(Box)`
    box-shadow: 0px 3px 20px 1px  ${theme.palette.primary.light};
    &:hover {
      box-shadow: none;
    }
  `;

  return (
    <StyledNav sx={{ ...containerStyles, background: theme.palette.secondary.main }} className="topnagga">
      <BoxRow sx={{ width: "80%", margin: "auto", justifyContent: "space-between" }}>
        <Box display="flex" gap={2} alignItems="center">
          <span>Zogh</span>
          <Avatar
            src={logo} alt="app logo" sizes="40px 40px"
            variant="circular" sx={{ cursor: 'pointer' }}
            onClick={() => navigate(PageUrlsEnum.home)}
          />
        </Box>
        <BoxRow sx={{ justifyContent: "end", gap: 2 }}>
          <BoxRow sx={{ margin: '0 1em' }}>{currentUser?.firstName ? truncatedUserName : ''}</BoxRow>
          <BoxRow><Hamburger /></BoxRow>
          <BoxRow><LanguageSelector /></BoxRow>
          <BoxRow><ThemeSelector /></BoxRow>
        </BoxRow>
      </BoxRow>
    </StyledNav>
  );
};

//TODO: custom componnts can't directly be wrapped with styled componnts. Rework props passing
const containerStyles = {
  position: "absolute",
  top: "0",
  right: 0,
  height: 50,
  width: "100vw",
  zIndex: 2,
  py: 1,
  px: 4,
  justifyContent: "space-between",
};

export default TopNav;