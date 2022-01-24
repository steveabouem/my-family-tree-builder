import React, {useEffect} from "react";
import {StyledUserMenu} from "./styles";

export const UserMenu = ({opened, setOpened, user}) => {

    return opened ? (
        <StyledUserMenu>
            <div className="user-menu-link">
                Logo
                <div className="close-menu hover red" onClick={() => setOpened(false)}>X</div>
            </div>
            {
                user ? (
                    <>
                        <div className="user-menu-link">user name</div>
                        <div className="user-menu-link">Notifications<div className="exp-num">2</div></div>
                        <div className="user-menu-link">Settings</div>
                        <div className="user-menu-link red hover">Logout</div>
                    </>
                ) : (
                    <div className="user-menu-link hover green">Login</div>
                )
            }
        </StyledUserMenu>
    ) : null;
};