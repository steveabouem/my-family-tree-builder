import React, { useContext, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';
import { useCreateFamilyTree } from 'api';
import { useZDispatch } from 'app/hooks';
import { resetAction } from 'app/slices/trees';
import PaperSection from 'components/common/containers/PaperSection';
import { FamilyTreeBuilderContainer } from './builder/FamilyTreeBuilderContainer';

const CreateFamilyTreePage = (): JSX.Element => {
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { isPending: isCreateTreePending } = useCreateFamilyTree();
  const dispatch = useZDispatch();
  const isProcessing = loading || isCreateTreePending;

  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
    dispatch(resetAction(undefined))
  }, []);

  return (
    <Page
      loading={isProcessing}
      title={<Trans>my_tree_page_title</Trans>} 
      subtitle={<Trans>manage_your_family_tree</Trans>}
    >
        <FamilyTreeBuilderContainer />
    </Page>
  );
}

export default CreateFamilyTreePage;