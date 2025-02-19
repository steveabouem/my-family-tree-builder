import React, {useEffect} from "react";
import {StyledUserMenu} from "../styles";

const UserMenu = ({opened, setOpened, user}) => {


    return opened ? (
        <StyledUserMenu>
            <Box className="w-100 d-flex align-content-center justify-content-end">
                <Box className="close-menu hover red" onClick={() => setOpened(false)}>X</Box>
            </Box>
            <Box className="user-menu-link">
                Logo
            </Box>
            {
                user ? (
                    <>
                        <Box className="user-menu-link">{user.name}</Box>
                        <Box className="user-menu-link">Notifications<Box className="exp-num">2</Box></Box>
                        <Box className="user-menu-link">Settings</Box>
                        <Box className="user-menu-link red hover">Logout</Box>
                    </>
                ) : (
                    <Box className="user-menu-link hover green">Login</Box>
                )
            }
        </StyledUserMenu>
    ) : null;
};

export default UserMenu;