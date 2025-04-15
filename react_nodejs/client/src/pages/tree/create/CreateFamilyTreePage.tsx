import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography } from '@mui/material';
import GenealogyContainer from './genealogy';
import ChartingContainer from './charting';
import FamilyTreeContext from 'contexts/creators/familyTree';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';
import { TreeStructureIcon, WritingIcon } from 'utils/assets/icons';

const CreateFamilyTreePage = (): JSX.Element => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const { currentUser } = useContext(FamilyTreeContext);
  const { modal, updateModal, toggleLoading } = useContext(GlobalContext);

  useEffect(() => {
    toggleLoading(false);
  }, []);

  function switchMode() {
    setMode(mode === 'manual' ? 'auto' : 'manual');
  }

  return (
    <Page title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>}>
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
        <Typography variant="body2"><Trans>change_mode</Trans></Typography>
        <Button variant="outlined" color="primary" sx={{ cursor: 'pointer' }} onClick={switchMode} size="small">
          {mode === "manual" ?
            <TreeStructureIcon sx={{ transform: "rotate(45deg)" }} />
            : <WritingIcon />
          }
        </Button>
      </Box>
      {mode === "manual" ? <GenealogyContainer /> : <ChartingContainer />}
    </Page>
  );
}

export default CreateFamilyTreePage;