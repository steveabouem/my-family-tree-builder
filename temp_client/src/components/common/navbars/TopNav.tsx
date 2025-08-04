import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { LiaUserSecretSolid } from "react-icons/lia";
import { RiUser5Fill } from "react-icons/ri";
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import logo from "utils/assets/images/logo.jpg";
import PageUrlsEnum from "utils/urls";
import ThemeSelector from "../ThemeSelector";
import { logout } from "services/auth";
import { useZSelector } from "app/hooks";
import { DUserState } from "app/slices/definitions";
import { updateUserAction } from "app/slices/user";

const TopNav = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const {currentUser} = useZSelector<DUserState>(state => state.user);

  const processLogout = () => {
    logout()
      .then(() => {
          updateUserAction({});
          navigate(PageUrlsEnum.home);
      })
      .catch((e: unknown) => {
        console.log('ERRR login out: ', e);
        // ! -TOFIX: handle error
      });
  }

  const isCurrentLocation = (path?: string) => {
    if (path) {
      return pathname.split('/')[1] === path;
    } else {
      return pathname === "/";
    }
  };

  return (
    <Box
      display="flex" position="absolute" top="0" right={0} height={50} width="100vw" zIndex={2} py={1} px={2}
      justifyContent="space-between" alignItems="center" sx={{ background: theme.palette.secondary.main }}
    >
      <Box display="flex" gap={2} alignItems="center">
        <span>Zogh</span><Avatar src={logo} alt="app logo" sizes="40px 40px" variant="circular" />
      </Box>
      <Box display="flex" justifyContent="end" gap={2}>
        <Box>
           <Link to={PageUrlsEnum.home} style={{color: theme.palette.secondary.dark,  textDecoration: isCurrentLocation() ? 'underline' : 'none' }} >
            <Typography variant="button" ><Trans>Home</Trans></Typography>
          </Link>
          
        </Box>
        {currentUser?.id ? (
          <>
            <Box>
              <Link to={PageUrlsEnum.user.replace(':id', `${currentUser.id}`)} style={{color: theme.palette.secondary.dark, textDecoration: isCurrentLocation("users") ? 'underline' : 'none' }}>
                <Typography variant="button">
                  <Trans>Profile</Trans>
                </Typography>
              </Link>
              
            </Box>
            <Box>
              <Link to={PageUrlsEnum.trees

              } style={{ color: theme.palette.secondary.dark, textDecoration: isCurrentLocation("family-trees") ? 'underline' : 'none' }}>
                <Typography variant="button" ><Trans>Trees</Trans></Typography>
              </Link>
            </Box>
          </>
        ) : null}
        <Box>
          <Link to="/connect" style={{color: theme.palette.secondary.dark,  textDecoration: isCurrentLocation("connect") ? 'underline' : 'none' }}>
            <Typography variant="button" ><Trans>Connect</Trans></Typography>
          </Link>
        </Box>
      </Box>
      <Box className="avatar-container" onClick={() => setMenuOpened(!menuOpened)} gap={2} display="flex" justifyContent="flex-between" alignItems="center">
        {currentUser?.first_name ? (
          <>
            <RiUser5Fill />   {currentUser.first_name}
          </>
        ) : <LiaUserSecretSolid />}
        {menuOpened && currentUser?.first_name && <Button variant="contained" color="success" onClick={processLogout} ><Trans>logout</Trans></Button>}
      </Box>
      <ThemeSelector />
    </Box>
  );
};

export default TopNav