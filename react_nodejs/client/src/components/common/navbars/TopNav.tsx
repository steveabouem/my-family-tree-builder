import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { DTopNavProps } from "../definitions";
import logo from "../../../assets/logo.jpg";
import { LiaUserSecretSolid } from "react-icons/lia";
import { RiUser5Fill } from "react-icons/ri";
import ThemeSelector from "../ThemeSelector";
import usePrimary from "../../hooks/usePrimary.hook";
import GlobalContext from "../../../context/global.context";
import FamilyTreeContext from "../../../context/familyTree.context";
import ButtonRounded from "../buttons/Rounded";
import AuthService from "../../../services";

const TopNav = ({ position, handleChangeTheme }: DTopNavProps) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const linkColor = usePrimary();
  const { theme } = useContext(GlobalContext);
  const { currentUser, updateUser } = useContext(FamilyTreeContext);
  const navigate = useNavigate();

  const processLogout = async () => {
    const authService = new AuthService('auth');
    await authService.logout();
    // TODO: handle error
    // .catch;
    updateUser({});
    navigate('/');
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
        {currentUser?.first_name ? (
          <>
            <RiUser5Fill />   {currentUser.first_name}
          </>
        ) : <LiaUserSecretSolid />}
      </div>
      {menuOpened && <ButtonRounded text="LOGOUT" action={() => processLogout()} />}
      <ThemeSelector switchTheme={handleChangeTheme} />
    </div>
  );
};

export default TopNav