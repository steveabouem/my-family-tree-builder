import React from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
import logo from "../../../assets/images/logo.jpg";
import { LiaUserSecretSolid } from "react-icons/lia";
import { RiUser5Fill } from "react-icons/ri";
import ThemeSelector from "../ThemeSelector";
import usePrimary from "../../../pages/hooks/usePrimary.hook";
import {service} from "../../../services";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import { Avatar, Box, Button, Link } from "@mui/material";
import theme from "utils/material/theme";

const TopNav = () => {
  const [menuOpened, setMenuOpened] = React.useState(false);
  const linkColor = usePrimary();
  const { currentUser, updateUser } = React.useContext(FamilyTreeContext);
  const navigate = useNavigate();

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

  return (
    <Box display="flex" position="absolute" top="0" right={0} height={50} width="100vw" zIndex={2} py={1} px={2} justifyContent="space-between" alignItems="center" sx={{background: theme.palette.grey['400']}}>
      <Box display="flex" gap={2} alignItems="center">
        <span>Zogh</span><Avatar src={logo} alt="app logo" sizes="40px 40px" variant="circular" />
      </Box>
      <Box display="flex" justifyContent="end">
        <Box>
          <Link href="/" color={linkColor}><Trans>Home</Trans></Link>
        </Box>
        {currentUser ? (
          <>
            <Box>
              <Link href={`/users/${currentUser.userId}`} color={linkColor}><Trans>Profile</Trans></Link>
            </Box>

            {/* <Box>
              <Link href="/families" color={linkColor}><Trans>Families</Trans></Link>
            </Box> */}

            <Box>
              <Link href="/family-trees/manage" color={linkColor}><Trans>Trees</Trans></Link>
            </Box>
          </>
        ) : null}
        <Box>
          <Link href="/connect" color={linkColor}><Trans>Connect</Trans></Link>
        </Box>
      </Box>
      <Box className="avatar-container" onClick={() => setMenuOpened(!menuOpened)}>
        {currentUser?.firstName ? (
          <>
            <RiUser5Fill />   {currentUser.firstName}
          </>
        ) : <LiaUserSecretSolid />}
      </Box>
      {menuOpened && <Button variant="contained" color="success" onClick={processLogout} >{}</Button>}
      <ThemeSelector />
    </Box>
  );
};

export default TopNav