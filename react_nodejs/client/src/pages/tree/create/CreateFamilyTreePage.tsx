import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography } from '@mui/material';
import GenealogyContainer from './genealogy';
import FamilyTreeContext from 'contexts/creators/familyTree';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';
import { TreeStructureIcon, WritingIcon } from 'utils/assets/icons';

const CreateFamilyTreePage = (): JSX.Element => {
  const { currentUser } = useContext(FamilyTreeContext);
  const { modal, updateModal, toggleLoading } = useContext(GlobalContext);

  useEffect(() => {
    toggleLoading(false);
  }, []);


  return (
    <Page title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>} prevUrl='family-trees'>
      <GenealogyContainer />
    </Page>
  );
}

export default CreateFamilyTreePage;