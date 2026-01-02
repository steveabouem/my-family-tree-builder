import React from 'react';
import { EmptyListProps } from 'types';
import BoxColumn from './containers/row/BoxColumn';
import { AddIcon, EmptyIcon } from 'utils/assets/icons';
import { Button, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import PaperSection from './containers/PaperSection';

const EmptyList = ({ message, icon, handleAdd }: EmptyListProps) => {
  const theme = useTheme();
  return (
    <PaperSection>
      <BoxColumn sx={{ ...messageBannerStyles, Background: theme.palette.background.default }}>
        {icon || <EmptyIcon size={60} color={theme.palette.warning.dark} />}
        <Typography variant='h4' >{message || <Trans>no_items_to_display_please_create</Trans>}</Typography>
        <Button variant="contained" color="primary">
          <AddIcon size={50} onClick={handleAdd} sx={{ cursor: 'pointer' }} />
        </Button>
      </BoxColumn>
    </PaperSection>
  );
};

const messageBannerStyles = {
  width: '100%',
  margin: 'auto',
  height: '100%',
  padding: '2em',
  alignItems: 'center',
  //Background:'${(props: {bg: string}) => props.bg}',
  textAlign: 'center',
};

export default EmptyList;