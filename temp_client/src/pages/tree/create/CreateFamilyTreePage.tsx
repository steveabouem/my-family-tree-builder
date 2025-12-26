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

const CreateFamilyTreePage = (): JSX.Element => {
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { isPending: isCreateFamilyTreePending } = useCreateFamilyTree();
  const { isPending: isAddMembersPending } = useAddMembers();
  const { isPending: isChangePositionsPending } = useChangeMemberPositions();
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetTreeById(id || '');
  const dispatch = useZDispatch();

  useEffect(() => {
    console.log({ data, isLoading });
    if (isSuccess && data.payload.members) {
      dispatch(populateTreeAction(data.payload));
      dispatch(changeformStepAction(0));
    }

  }, [data, isSuccess, isLoading]);
  const isProcessing = isAddMembersPending || isCreateFamilyTreePending || isChangePositionsPending || isLoading|| loading;

  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
  }, []);

  useEffect(() => {
    console.log({isAddMembersPending, isChangePositionsPending, isCreateFamilyTreePending});
    
  }, [isProcessing])
  return (
    <Page loading={isProcessing} title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>} prevUrl='family-trees'>
      <GenealogyContainer />
    </Page>
  );
}

export default CreateFamilyTreePage;