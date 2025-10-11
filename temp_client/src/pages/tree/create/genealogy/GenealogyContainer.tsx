import React, { useEffect, useState } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import GenealogyForm from './GenealogyForm';
import { FamilyTreeState, StepFormState, UserState, stepFormModes, FamilyTree } from 'types';
import { useZDispatch, useZSelector } from 'app/hooks';
import { populateTreeAction, saveTreeIdAction } from 'app/slices/trees';
import GlobalContext from 'contexts/creators/global';
import { formatOutgoingValues, formatTreeMembers } from 'pages/tree/create/genealogy/utils';
import { useCreateFamilyTree, useAddMembers } from 'services/v2/familyTreeV2';
import GenealogyTree from 'pages/tree/layout/GenealogyTree';

const GenealogyContainer: React.FC = () => {
  const [treeCopy, setTreeCopy] = useState({});
  const { stepTree = {}, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const { treeId } = useZSelector<FamilyTreeState>(state => state.tree);
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const dispatch = useZDispatch();
  const { updateModal, modal } = React.useContext(GlobalContext);
  const createFamilyTreeMutation = useCreateFamilyTree();
  const addMembersMutation = useAddMembers();
  const userId = currentUser?.userId || 0;

  // useEffect(() => {
  //   console.log('Rerendered from treeCopy', treeCopy)
  // }, [treeCopy])
  // useEffect(() => {
  //   console.log('Rerendered from stepTree', stepTree)
  // }, [stepTree])
  // useEffect(() => {
  //   console.log('Rerendered from treeId', treeId)
  // }, [treeId])
  // useEffect(() => {
  //   console.log('Rerendered from currentUser', currentUser)
  // }, [currentUser])
  // useEffect(() => {
  //   console.log('Rerendered from modal', modal)
  // }, [modal])

  function handleSubmit(v: any) {
    const formattedValues: FamilyTree = formatOutgoingValues(v, stepTree, userId);

    try {
      if (mode === stepFormModes.edit) {
        addMembersMutation.mutate(
          { ...formattedValues, id: treeId || 0, userId },
          {
            onSuccess: (response) => {
              if (response.code == 200) {
                // @ts-ignore
                const updatedListOfMembers = response.payload.members;
                // const formattedMemberRecords = formatTreeMembers(updatedListOfMembers);
                updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_success_modal</Trans></Typography>, type: 'success' });
                dispatch(populateTreeAction(updatedListOfMembers));
              } else {
                updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_failed_modal</Trans></Typography>, type: 'error' });
              }
            },
            onError: (error) => {
              console.error('Failed to add members:', error);
              updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_failed_modal</Trans></Typography>, type: 'error' });
            }
          }
        );
      } else {
        createFamilyTreeMutation.mutate(
          formattedValues,
          {
            onSuccess: (response) => {
              console.log('Success', { response });
              if (response.code == 200) {
                dispatch(populateTreeAction(response.payload));
                dispatch(saveTreeIdAction(response.payload.id));
                updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_success_modal</Trans></Typography>, type: 'success' });
              } else {
                updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_failed_modal</Trans></Typography>, type: 'error' });
              }
            },
            onError: (error) => {
              console.error('Failed to create tree:', error);
              updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_failed_modal</Trans></Typography>, type: 'error' });
            }
          }
        );
      }
    } catch (e: unknown) {
      console.log('Failed to create tree', e);
    }
  }

  return (
    <Box sx={mainContainerStyle}>
      <Typography variant='body1'><Trans>graph_mode_tree_intro</Trans></Typography>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {(props) => (
          <Grid2 container spacing={2} sx={gridContainerStyle}>
            <Grid2 size={6} >
              <GenealogyForm treeCopy={treeCopy} setTreeCopy={setTreeCopy} />
            </Grid2>
            <Grid2 size={6}>
              <GenealogyTree />
            </Grid2>
          </Grid2>
        )}
      </Formik>
    </Box>
  );
};

const mainContainerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const gridContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

export default GenealogyContainer;