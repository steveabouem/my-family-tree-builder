import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import { useNavigate } from 'react-router';
import BoxColumn from './containers/row/BoxColumn';
import { LoginIcon, WarningIcon } from 'utils/assets/icons';
import BoxRow from './containers/column';
import PageUrlsEnum from 'utils/urls';

const NotAllowed = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <BoxColumn sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <WarningIcon size={40} color={theme.palette.warning.dark} />
      <Typography variant='h4' ><Trans>content_not_allowed</Trans></Typography>
      <BoxRow sx={{ justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => navigate(PageUrlsEnum.auth)}>
          <BoxRow>
            <Trans>login</Trans>
            <LoginIcon link size={15} tooltip={<Trans>login</Trans>}
            />
          </BoxRow>
        </Button>
      </BoxRow>
    </BoxColumn>
  );
};

export default NotAllowed;