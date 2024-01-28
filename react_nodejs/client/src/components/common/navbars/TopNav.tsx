import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { DTopNavProps } from "../definitions";
import logo from "../../../assets/logo.jpg";
import { LiaUserSecretSolid } from "react-icons/lia";
import { RiUser5Fill } from "react-icons/ri";
import ThemeSelector from "../ThemeSelector";
import usePrimary from "../../hooks/usePrimary.hook";
import GlobalContext from "../../../context/creators/global.context";
import FamilyTreeContext from "../../../context/creators/familyTree.context";
import ButtonRounded from "../buttons/Rounded";
import service from "../../../services";

const TopNav = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const linkColor = usePrimary();
  const { theme } = useContext(GlobalContext);
  const { currentUser, updateUser } = useContext(FamilyTreeContext);
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
      console.log('ERRR: ', e);
      // ! -TOFIX: handle error
    });
  }

  return (
    <div className={"navigation " + theme}>
      <div className="logo-container">
        <span>Zogh</span><img src={logo} alt="app logo" />
      </div>
      <div className="pages-links">

        <div className="accent">
          <Link to="/" color={linkColor}><Trans>Home</Trans></Link>
        </div>

        <div className="accent">
          <Link to="/users/:id" color={linkColor}><Trans>Profile</Trans></Link>
        </div>

        <div className="accent">
          <Link to="/family" color={linkColor}><Trans>Families</Trans></Link>
        </div>

        <div className="accent">
          <Link to="/family-tree" color={linkColor}><Trans>Trees</Trans></Link>
        </div>

        <div className="accent">
          <Link to="/connect" color={linkColor}><Trans>Connect</Trans></Link>
        </div>
      </div>
      <div className="avatar-container" onClick={() => setMenuOpened(!menuOpened)}>
        {currentUser?.firstName ? (
          <>
            <RiUser5Fill />   {currentUser.firstName}
          </>
        ) : <LiaUserSecretSolid />}
      </div>
      {menuOpened && <ButtonRounded text="LOGOUT" action={() => processLogout()} />}
      <ThemeSelector />
    </div>
  );
};

export default TopNav