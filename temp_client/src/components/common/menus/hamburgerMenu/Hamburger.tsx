import React, { ReactNode, useContext, useMemo, useState } from 'react';
import { LogoutIcon, ArrowDownIcon, ArrowUpIcon } from 'utils/assets/icons';
import styled from "styled-components";
import BoxColumn from 'components/common/containers/row/BoxColumn';
import { Box, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import PageUrlsEnum from 'utils/urls';
import { useZDispatch, useZSelector } from 'app/hooks';
import { useLogout } from 'api';
import { useLocation, useNavigate } from 'react-router';
import GlobalContext from 'contexts/creators/global';
import { clearUserAction } from 'app/slices/user';
import { Link } from 'react-router-dom';
import BoxRow from 'components/common/containers/column';
import { persistor } from 'app/store';
import { UserState } from 'types';

const Hamburger = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { updateModal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const {currentUser} = useZSelector<UserState>((state) => state.user);
  const userLoggedIn = !!currentUser?.userId;
  const { mutateAsync: logoutMutateAsync } = useLogout();
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // TODO: declare standard sizes, em's etc
  const Buns = styled(Box)`
    position: relative;
    height: 20px;
    max-height: 20px;
  `;
  const MenuLink = styled(Link) <{ active: boolean }>`
    text-decoration: none;
    color: ${theme.palette.secondary.dark};
    &.warn {
      color: ${theme.palette.error.light};
    }
    &:hover {
        text-decoration: underline;
    }
  `;

  const menuIcon = useMemo(() => isOpened ?
    <ArrowUpIcon link color={theme.palette.primary.dark} onClick={toggleMenu} sx={{ position: 'absolute', top: 0, right: 0 }} /> :
    <ArrowDownIcon link color={theme.palette.primary.dark} onClick={toggleMenu} sx={{ position: 'absolute', top: 0, right: 0 }} tooltip={<Trans>open_menu</Trans>} />, [isOpened]
  );
  const isCurrentLocation = (path?: string) => {
    if (path) {
      return pathname.split('/')[1] === path;
    } else {
      return pathname === "/";
    }
  };
  const links: { label: string | ReactNode, onClick?: () => void, url?: string, addClass?: string }[] = [
    { url: PageUrlsEnum.home, label: <Trans>home_page_link</Trans> },
    { url: userLoggedIn ? PageUrlsEnum.user : PageUrlsEnum.auth , label: <Trans>profile_page_link</Trans> },
    { url: userLoggedIn ? PageUrlsEnum.trees : PageUrlsEnum.auth , label: <Trans>trees_page_link</Trans> },
    { addClass: 'warn', label: <BoxRow><Trans>logout</Trans><LogoutIcon link tooltip={<Trans>Logout</Trans>} /></BoxRow>, onClick: () => showLogoutWarning() }
  ];

  function toggleMenu() {
    setIsOpened(!isOpened);
  }
  function showLogoutWarning() {
    updateModal({
      title: <Trans>loggin_out_title</Trans>,
      content: <Trans>do_you_want_to_logout?</Trans>,
      onConfirm: () => {
        processLogout();
      },
      buttons: {
        confirm: true,
        cancel: true
      },
      hidden: false
    });
  }
  async function processLogout() {
    try {
      await logoutMutateAsync();
      dispatch(clearUserAction());
      await persistor.purge();
      updateModal({
        buttons: { cancel: false, confirm: true, confirmText: <Trans>close</Trans> },
        title: <Trans>operation_success_title</Trans>,
        content: <Trans>operation_success_text</Trans>,
        type: 'success',
        onConfirm: () => { navigate(PageUrlsEnum.auth); },
        hidden: false
      });
    } catch {
      updateModal({
        buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
        title: <Trans>operation_failure_title</Trans>,
        content: <Trans>operation_failure_text</Trans>,
        type: 'error',
        hidden: false
      });
    }
  }
  function handleLinkClick(callback?: () => void) {
    if (callback) {
      callback();
    }
    toggleMenu();
  }

  return (
    <Buns>
      {menuIcon}
      {isOpened ? (
        <BoxColumn sx={{ ...menuStyles, background: theme.palette.secondary.light }}>
          {links.map((l) => (
            <MenuLink
              to={l?.url || ''} active={isCurrentLocation(l?.url)}
              onClick={() => handleLinkClick(l?.onClick || toggleMenu)} className={l?.addClass || ''}
            >
              {l.label}
            </MenuLink>
          ))}
        </BoxColumn>
      ) : ''}
    </Buns>
  )
};

export const menuStyles = {
  position: 'absolute',
  width: '30vw',
  height: '25vh',
  top: 0,
  right: 0,
  transform: 'translateY(25px)',
  padding: '1rem'
};

export default Hamburger;