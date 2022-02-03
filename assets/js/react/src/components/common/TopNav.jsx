import React, {useState} from "react";
import {StyledNav} from "./styles";
import logo from "../../../public/media/elephant.png";
import user from "../../../public/media/male_user_large.png";
import {NavLink} from "react-bootstrap";
import {UserMenu} from "./UserMenu";

export const TopNav = () => {
    const [menuOpened, setMenuOpened] = useState(false);

    return (
        <StyledNav>
            <div className="position-relative topnav-section">
                <div className="top-logo-label">Zogh Tracker</div>
                <img src={logo} className="top-logo-main" alt="App Logo"/>
            </div>
            <div className="topnav-section">
                <div>
                    <NavLink href="/my-household">household</NavLink>
                </div>
                <div>
                    <NavLink href="">goals</NavLink>
                </div>
                <div>
                    <NavLink href="">tasks</NavLink>
                </div>
                <div className="position-relative">
                    <div className="avatar-container green hover" onClick={() => setMenuOpened(!menuOpened)}>
                        <img className="user-avatar-top" src={user} alt="User Avatar" />
                    </div>
                </div>
            </div>
            {menuOpened ?   <UserMenu
                                user={true}
                                opened={menuOpened}
                                setOpened={() => setMenuOpened(!menuOpened)}
                            /> : null}
        </StyledNav>
    );
};