import React from 'react';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { FamilyTreeIcon } from 'utils/assets/icons';

const DataProgress = () => {
  return (
    <Box display="flex" width="100%" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h3"><Trans>fill_in_the_form_first</Trans></Typography>
      <FamilyTreeIcon color='#e0e0e0' size={250} sx={{opacity: '.25'}} />
    </Box>
  )
};

export default DataProgress