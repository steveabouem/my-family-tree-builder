import React, { useContext, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { useParams } from 'react-router';
import GenealogyContainer from './genealogy';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';
import { useCreateFamilyTree, useGetTreeById } from 'api';
import { useZDispatch } from 'app/hooks';
import { populateTreeAction, resetAction } from 'app/slices/trees';
import PaperSection from 'components/common/containers/PaperSection';
import { changeformStepAction } from 'app/slices/forms/stepForm';

const CreateFamilyTreePage = (): JSX.Element => {
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { id } = useParams();
  const { data, isLoading: isUserTreeLoading, isSuccess } = useGetTreeById(id || '', !!id); // TODO: use vw page instead of playing with the enabled prop
  const {  isPending: isCreateTreePending } = useCreateFamilyTree();
  const dispatch = useZDispatch();
  const isProcessing = isUserTreeLoading || loading || isCreateTreePending;

  useEffect(() => {
    if (isSuccess && data.payload.members) {
      dispatch(populateTreeAction(data.payload));
      dispatch(changeformStepAction(0));
    }
  }, [data, isSuccess, isUserTreeLoading, isCreateTreePending]);

  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
    dispatch(resetAction(undefined))
  }, []);

  return (
    <Page loading={isProcessing} 
      title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>manage_your_family_tree</Trans>}
      prevUrl='family-trees'
    >
      <PaperSection>
        <GenealogyContainer />
      </PaperSection>
    </Page>
  );
}

export default CreateFamilyTreePage;