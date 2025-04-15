import React, { useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { Trans } from '@lingui/macro';

const NodeMenu = ({ data }: { data: Node }) => {
  const [selectedAction, setSelectedAction] = useState<'edit' | 'delete' | 'expand'>("expand");

  return (
    <Box display="flex" flexDirection="column" alignItems="start" gap={2}>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={selectedAction}
        >
          <FormControlLabel
            value="female" control={<Radio />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>edit_node</Trans>
              </Typography>
            }
          />
          <FormControlLabel
            value="female" control={<Radio />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>add_node_relative</Trans>
              </Typography>
            }
          />
          <FormControlLabel
            value="female" control={<Radio />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>delete</Trans>
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default NodeMenu;