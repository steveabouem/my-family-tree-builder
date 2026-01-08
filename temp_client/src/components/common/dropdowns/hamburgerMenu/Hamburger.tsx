import React, { ReactNode, useContext, useMemo, useState } from 'react';
import { ExitIcon, IncognitoIcon, ArrowDownIcon, ArrowUpIcon } from 'utils/assets/icons';
// @ts-ignore
import styled from "styled-components";
import BoxColumn from 'components/common/containers/row/BoxColumn';
import { Box, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import PageUrlsEnum from 'utils/urls';
import { useZDispatch, useZSelector } from 'app/hooks';
import { UserState } from 'types';
import { useLogout } from 'services/v2';
import { useLocation } from 'react-router';
import GlobalContext from 'contexts/creators/global';
import { resetUserAction } from 'app/slices/user';
import { Link } from 'react-router-dom';
import BoxRow from 'components/common/containers/column';

const Hamburger = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { updateModal } = useContext(GlobalContext);
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const dispatch = useZDispatch();
  const { mutate: logoutMutation } = useLogout();
  const theme = useTheme();
  const { pathname } = useLocation();

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
    <ArrowUpIcon link onClick={toggleMenu} sx={{ position: 'absolute', top: 0, right: 0 }} /> :
    <ArrowDownIcon link onClick={toggleMenu} sx={{ position: 'absolute', top: 0, right: 0 }} />, [isOpened]
  );
  const isCurrentLocation = (path?: string) => {
    if (path) {
      return pathname.split('/')[1] === path;
    } else {
      return pathname === "/";
    }
  };
  const authLink = currentUser?.userId ?
    { addClass: 'warn', label: <BoxRow><Trans>logout</Trans><ExitIcon link /></BoxRow>, onClick: () => showLogoutWarning() }
    :
    { url: PageUrlsEnum.auth, label: <Trans>authentication_page_link</Trans> };
  const links: { label: string | ReactNode, onClick?: () => void, url?: string, addClass?: string }[] = [
    { url: PageUrlsEnum.home, label: <Trans>home_page_link</Trans> },
    { url: PageUrlsEnum.user.replace(':id', `${currentUser?.userId || 0}`), label: <Trans>profile_page_link</Trans> },
    { url: PageUrlsEnum.trees, label: <Trans>trees_page_link</Trans> },
    authLink
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
  function processLogout() {
    logoutMutation(undefined, {
      onError: () => updateModal({
        buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
        title: <Trans>operation_failure_title</Trans>,
        content: <Trans>operation_failure_text</Trans>,
        type: 'error',
        hidden: false
      }),
      onSuccess: () => {
        localStorage.clear();
        dispatch(resetUserAction());
        updateModal({
          buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
          title: <Trans>operation_success_title</Trans>,
          content: <Trans>operation_success_text</Trans>,
          type: 'success',
          hidden: false
        })
      },
    });
  }

  return (
    <Buns>
      {menuIcon}
      {isOpened ? (
        <BoxColumn sx={{ ...menuStyles, background: theme.palette.secondary.light }}>
          {links.map((l) => (
            <MenuLink
              to={l?.url || ''} isSelected={isCurrentLocation(l?.url)}
              onClick={l?.onClick} className={l?.addClass || ''}
            >
              {l.label}
            </MenuLink>
          ))}
        </BoxColumn>
      ) : ''}
    </Buns>
  )
};

const menuStyles = {
  position: 'absolute',
  width: '30vw',
  height: '25vh',
  top: 0,
  right: 0,
  transform: 'translateY(25px)',
  padding: '1rem'
};

export default Hamburger;