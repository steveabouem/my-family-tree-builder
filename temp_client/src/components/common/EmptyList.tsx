import React from 'react';
import { EmptyListProps } from 'types';
import BoxColumn from './containers/row/BoxColumn';
import { AddIcon, EmptyIcon, ReloadIcon } from 'utils/assets/icons';
import { Button, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import BoxRow from './containers/column';

const EmptyList = ({ message, icon, handleAdd, handleRefresh }: EmptyListProps) => {
  const theme = useTheme();
  return (
    <BoxColumn sx={{ ...messageBannerStyles, Background: theme.palette.background.default }}>
      {icon || <EmptyIcon size={40} color={theme.palette.warning.dark} />}
      <Typography variant='h4' >{message || <Trans>no_items_to_display_please_create</Trans>}</Typography>
      <BoxRow sx={{justifyContent: 'center'}}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          <BoxRow>
            <Trans>create_new</Trans>
            <AddIcon link size={15} />
          </BoxRow>
        </Button>
        <Button variant="contained" color="primary" onClick={handleRefresh}>
          <BoxRow>
            <Trans>refresh</Trans>
            <ReloadIcon link size={15} />
          </BoxRow>
        </Button>
      </BoxRow>
    </BoxColumn>
  );
};

const messageBannerStyles = {
  width: '100%',
  margin: 'auto',
  height: '100%',
  padding: '2em',
  alignItems: 'center',
  textAlign: 'center',
};

export default EmptyList;