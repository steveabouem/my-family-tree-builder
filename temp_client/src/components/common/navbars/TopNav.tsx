import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import logo from "utils/assets/images/logo.jpg";
import PageUrlsEnum from "utils/urls";
import ThemeSelector from "../ThemeSelector";
import { useZSelector } from "app/hooks";
import { UserState } from "types";
import BoxRow from "../containers/column";
import Hamburger from "../menus/hamburgerMenu/Hamburger";
import LanguageSelector from "../LanguageSelector";

const TopNav = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const truncatedUserName = currentUser?.firstName?.split('')?.map((s, i) => { if (i > 5) { return '.' } return s })?.join('');
  const navStyles = `
    box-shadow: 0px 3px 20px 1px  ${theme.palette.primary.light};
    position: absolute;
    top: 0;
    right: 0;
    height: 50;
    width: 100vw;
    z-index: 2;
    padding: .5rem 0;
    justify-content: "space-between";
    background: ${theme.palette.secondary.main};
    &:hover {
      box-shadow: none;
    }
  `;

  return (
    <BoxRow hasCustomStyles styledProps={navStyles} >
      <BoxRow sx={{ width: "calc(75% - 8px)", margin: "0 calc(12.5% - 20px) 0 12.5%", justifyContent: "space-between" }}>
        <BoxRow>
          <Typography variant="h3" color={theme.palette.primary.dark} p={0}>Zogh</Typography>
          <Avatar
            src={logo} alt="app logo" sizes="40px 40px"
            variant="circular" sx={{ cursor: 'pointer' }}
            onClick={() => navigate(PageUrlsEnum.home)}
          />
        </BoxRow>
        <BoxRow sx={{ justifyContent: "end", gap: 2 }}>
          <Typography variant="body1" color={theme.palette.primary.dark}>{currentUser?.firstName ? truncatedUserName : ''}</Typography>
          <Hamburger />
          <LanguageSelector />
          <ThemeSelector />
        </BoxRow>
      </BoxRow>
    </BoxRow>
  );
};

export default TopNav;