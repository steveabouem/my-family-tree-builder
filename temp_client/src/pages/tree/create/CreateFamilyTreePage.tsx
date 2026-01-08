import React, { useContext, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import GenealogyContainer from './genealogy';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';
import { useAddMembers, useChangeMemberPositions, useCreateFamilyTree, useGetTreeById } from 'services/v2';
import { useParams } from 'react-router';
import { useZDispatch } from 'app/hooks';
import { populateTreeAction } from 'app/slices/trees';
import { changeformStepAction } from 'app/slices/forms/stepForm';
import PaperSection from 'components/common/containers/PaperSection';

const CreateFamilyTreePage = (): JSX.Element => {
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { id } = useParams();
  const { data, isLoading: isUserTreeLoading, isSuccess } = useGetTreeById(id || '');
  const {  isPending: isCreateTreePending } = useCreateFamilyTree();
  const dispatch = useZDispatch();
  const isProcessing = isUserTreeLoading || loading || isCreateTreePending;

  useEffect(() => {
    console.log({ data, isUserTreeLoading, isCreateTreePending });
    if (isSuccess && data.payload.members) {
      dispatch(populateTreeAction(data.payload));
      dispatch(changeformStepAction(0));
    }

  }, [data, isSuccess, isUserTreeLoading, isCreateTreePending]);

  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
  }, []);

  return (
    <Page loading={isProcessing} title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>} prevUrl='family-trees'>
      <PaperSection>
        <GenealogyContainer />
      </PaperSection>
    </Page>
  );
}

export default CreateFamilyTreePage;