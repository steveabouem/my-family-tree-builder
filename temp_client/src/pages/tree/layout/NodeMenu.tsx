import React, { useContext, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from '@mui/material'
import { Trans } from '@lingui/macro';
import GlobalContext from 'contexts/creators/global';
import { NodeMenuActions, ReactFlowNode } from 'types';
import { Link } from 'react-router-dom';
import PageUrlsEnum from 'utils/urls';
import BoxColumn from 'components/common/containers/row/BoxColumn';
import styled from 'styled-components';

const NodeMenu = ({ data }: { data: Pick<ReactFlowNode, 'data'> }) => {
  const [selectedAction, setSelectedAction] = useState<'edit' | 'delete' | 'expand'>("expand");
  const { updateModal, modal, clearModal } = useContext(GlobalContext);
  const theme = useTheme();

  function selectOption(e: any) {
    setSelectedAction(e.target.value);
    updateModal({ ...modal, transferData: e.target.value });
  }

  return (
    <BoxColumn>
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
        <LinkToMember to={PageUrlsEnum.viewMember.replace(':id', `${data.data.id}`)} onClick={() => clearModal()}>
          <Typography variant='body2' color={theme.palette.info.main}><Trans>go_to_member_page</Trans></Typography>
        </LinkToMember>
      </FormControl>
    </BoxColumn>
  );
};

const LinkToMember = styled(Link)`
  text-decoration: none;
  margin-left: auto;
`;

export default NodeMenu;