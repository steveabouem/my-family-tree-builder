import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import { useNavigate } from 'react-router';
import BoxColumn from './containers/row/BoxColumn';
import { LoginIcon, ReloadIcon, WarningIcon } from 'utils/assets/icons';
import BoxRow from './containers/column';
import PageUrlsEnum from 'utils/urls';

const NotFound = ({ handleReload }: { handleReload: () => void }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <BoxColumn sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <WarningIcon size={40} color={theme.palette.warning.dark} />
            <Typography variant='h4' ><Trans>no_items_to_display_please_create</Trans></Typography>
            <BoxRow sx={{justifyContent: 'center'}}>
                <Button variant="contained" color="primary" onClick={() => handleReload()}>
                    <BoxRow>
                        <Trans>refresh</Trans>
                        <ReloadIcon link size={15} tooltip={<Trans>refresh</Trans>} />
                    </BoxRow>
                </Button>
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

export default NotFound;