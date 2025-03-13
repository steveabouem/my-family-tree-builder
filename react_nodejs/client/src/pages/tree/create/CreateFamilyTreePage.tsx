import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import GenealogyContainer from './genealogy';
import ChartingContainer from './charting';
import FamilyTreeContext from '@/contexts/creators/familyTree';
import GlobalContext from '@/contexts/creators/global';
import Page from '@/components/common/Page';

const CreateFamilyTreePage = (): JSX.Element => {
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [hasSpouse, setHasSpouse] = useState<boolean>(true);
  const { currentUser } = useContext(FamilyTreeContext);
  const { modal, updateModal, toggleLoading } = useContext(GlobalContext);

  useEffect(() => {
    if (toggleLoading) toggleLoading(false);
  }, []);

  useEffect(() => {
    if (hasSpouse && updateModal) {
      updateModal({
        ...modal,
        content: <Trans>added_spouse_fields</Trans>,
        hidden: false,
        buttons: { confirm: true, cancel: false }
      });
    }
  }, [hasSpouse, mode]);

  return (
    <Page title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>}>
      {mode === "manual" ?  <GenealogyContainer /> : <ChartingContainer />}
    </Page>
  );
}

export default CreateFamilyTreePage;