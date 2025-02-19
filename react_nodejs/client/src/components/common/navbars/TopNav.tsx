import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
import logo from "../../../assets/images/logo.jpg";
import { LiaUserSecretSolid } from "react-icons/lia";
import { RiUser5Fill } from "react-icons/ri";
import usePrimary from "../../../pages/hooks/usePrimary.hook";
import { service } from "../../../services";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import { Avatar, Box, Button, Link, Typography } from "@mui/material";
import theme from "utils/material/theme";

const TopNav = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const linkColor = usePrimary();
  const { currentUser, updateUser } = useContext(FamilyTreeContext);
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const processLogout = () => {
    const authService = new service.auth('auth');
    authService.logout()
      .then(() => {
        if (updateUser) {
          updateUser({});
          navigate('/');
        }
      })
      .catch((e: unknown) => {
        console.log('ERRR login out: ', e);
        // ! -TOFIX: handle error
      });
  }

  const isCurrentLocation = (path?:string) => {
    if (path) {
      return pathname.split('/')[1] === path;
    } else { 
      return pathname === "/";
    }
  };

  return (
    <Box display="flex" position="absolute" top="0" right={0} height={50} width="100vw" zIndex={2} py={1} px={2} justifyContent="space-between" alignItems="center" sx={{ background: theme.palette.grey['400'] }}>
      <Box display="flex" gap={2} alignItems="center">
        <span>Zogh</span><Avatar src={logo} alt="app logo" sizes="40px 40px" variant="circular" />
      </Box>
      <Box display="flex" justifyContent="end" gap={2}>
        <Box>
          <Link href="/" color={'secondary'} sx={{ textDecoration: isCurrentLocation() ? 'underline' : 'none' }} >
            <Typography variant="button" ><Trans>Home</Trans></Typography>
          </Link>
        </Box>
        {currentUser ? (
          <>
            <Box>
              <Link href={`/users/${currentUser.userId}`} color={'secondary'} sx={{ textDecoration: isCurrentLocation("users") ? 'underline' :  'none' }}>
                <Typography variant="button">
                  <Trans>Profile</Trans>
                </Typography>
              </Link>
            </Box>

            {/* <Box>
              <Link href="/families" color={'secondary'} sx={{ textDecoration: isCurrentLocation() 'none' }}><Trans>Families<? 'underline' : /Trans></Link>
            </Box> */}

            <Box>
              <Link href="/family-trees/manage" color={'secondary'} sx={{ textDecoration: isCurrentLocation("family-trees")? 'underline' :  'none' }}>
                <Typography variant="button" ><Trans>Trees</Trans></Typography>
              </Link>
            </Box>
          </>
        ) : null}
        <Box>
          <Link href="/connect" color={'secondary'} sx={{ textDecoration: isCurrentLocation("connect")? 'underline' :  'none' }}>
            <Typography variant="button" ><Trans>Connect</Trans></Typography>
          </Link>
        </Box>
      </Box>
      <Box className="avatar-container" onClick={() => setMenuOpened(!menuOpened)} gap={2} display="flex" justifyContent="flex-between" alignItems="center">
        {currentUser?.firstName ? (
          <>
            <RiUser5Fill />   {currentUser.firstName}
          </>
        ) : <LiaUserSecretSolid />}
        {menuOpened && <Button variant="contained" color="success" onClick={processLogout} ><Trans>logout</Trans></Button>}
      </Box>
      {/* <ThemeSelector /> */}
    </Box>
  );
};

export default TopNav