import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, useTheme } from "@mui/material";
import logo from "utils/assets/images/logo.jpg";
import PageUrlsEnum from "utils/urls";
import ThemeSelector from "../ThemeSelector";
import { useZSelector } from "app/hooks";
import { UserState } from "types";
import BoxRow from "../containers/column";
import Hamburger from "../dropdowns/hamburgerMenu/Hamburger";

const TopNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const truncatedUserName = currentUser?.firstName?.split('')?.map((s, i) => { if (i > 5) { return '.' } return s })?.join('');

  return (
    <Box sx={{ ...containerStyles, background: theme.palette.secondary.main }}
    >
      <BoxRow sx={{ width: "100%" }}>
        <Box display="flex" gap={2} alignItems="center" flex="0 25%">
          <span>Zogh</span>
          <Avatar
            src={logo} alt="app logo" sizes="40px 40px"
            variant="circular" sx={{ cursor: 'pointer' }}
            onClick={() => navigate(PageUrlsEnum.home)}
          />
        </Box>
        <BoxRow sx={{ justifyContent: "end", gap: 2, flex: "0 60%" }}>
          <BoxRow sx={{ margin: '0 1em' }}>{currentUser?.firstName ? truncatedUserName : ''}</BoxRow>
          <BoxRow><Hamburger /></BoxRow>
          <BoxRow><ThemeSelector /></BoxRow>
        </BoxRow>
      </BoxRow>
    </Box>
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
  px: 2,
  justifyContent: "space-between",
};

export default TopNav;