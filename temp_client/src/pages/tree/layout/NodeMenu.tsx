import React, { useContext, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { Trans } from '@lingui/macro';
import GlobalContext from 'contexts/creators/global';
import { ReactFlowNode } from 'services/api.definitions';
import { NodeMenuActions } from '../definitions';

const NodeMenu = ({ data }: { data: Pick<ReactFlowNode, 'data'> }) => {
  const [selectedAction, setSelectedAction] = useState<'edit' | 'delete' | 'expand'>("expand");
  const {updateModal, modal} = useContext(GlobalContext);

  function selectOption(e: any) {
    setSelectedAction(e.target.value);
    updateModal({...modal, transferData: e.target.value});
  }

  return (
    <Box sx={menuContainerStyle}>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={selectedAction}
        >
          <FormControlLabel
            value={NodeMenuActions.edit} control={<Radio size='small' onClick={selectOption} />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>edit_node</Trans>
              </Typography>
            }
          />
          <FormControlLabel
            value="delete" control={<Radio size='small' onClick={selectOption} />}
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

const menuContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: 2,
};

export default NodeMenu;