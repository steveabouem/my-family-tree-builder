import React, { useState } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import GenealogyForm from './GenealogyForm';
import { FamilyTreeState, StepFormState, UserState, stepFormModes, FamilyTree } from 'types';
import { useZDispatch, useZSelector } from 'app/hooks';
import { populateTreeAction, saveTreeIdAction } from 'app/slices/trees';
import { changeformStepAction } from 'app/slices/forms/stepForm';
import GlobalContext from 'contexts/creators/global';
import { formatOutgoingValues } from 'pages/tree/create/genealogy/utils';
import { useCreateFamilyTree, useAddMembers } from 'services/v2/familyTreeV2';
import GenealogyTree from 'pages/tree/layout/GenealogyTree';

const GenealogyContainer: React.FC = () => {
  // treeCopy is used to keep copy of the tree through all events.
  // for instance, updating a member requires to rerender the form with only that member's fields.
  // the copy allows for the other existing members to remain rendered in the graph
  const [treeCopy, setTreeCopy] = useState({});
  const { stepTree = {}, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const { currentFamilyTree } = useZSelector<FamilyTreeState>(state => state.tree);
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const dispatch = useZDispatch();
  const { updateModal } = React.useContext(GlobalContext);
  const { mutate: createFamilyTreeMutation } = useCreateFamilyTree();
  const { mutate: addMembersMutation } = useAddMembers();
  const userId = currentUser?.userId || 0;

  function grabProfilePictureFile(f: any) {
    console.log('file', f);
    
  }
  function handleSubmit(v: any) {
    const formattedValues: FamilyTree = formatOutgoingValues(v, stepTree, userId, currentFamilyTree?.id);

    try {
      if (mode === stepFormModes.edit) {
        addMembersMutation(
          { ...formattedValues, id: currentFamilyTree?.id || 0, userId },
          {
            onSuccess: (response) => {
              setTimeout(() => {
                if (response.code == 200) {
                  updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_success_modal</Trans></Typography>, type: 'success' });
                  // @ts-ignore
                  dispatch(populateTreeAction(response.payload));
                  dispatch(changeformStepAction(0));
                } else {
                  updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_failed_modal</Trans></Typography>, type: 'error' });
                }
              }, 1000);
            },
            onError: (error) => {
              console.error('Failed to add members:', error);
              updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_failed_modal</Trans></Typography>, type: 'error' });
            }
          }
        );
      } else {
        // Ensure userId is at the top level for the backend
        createFamilyTreeMutation(
          { ...formattedValues, userId },
          {
            onSuccess: (response) => {
              if (response.code == 200) {
                updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_success_modal</Trans></Typography>, type: 'success' });
                dispatch(populateTreeAction(response.payload));
                dispatch(saveTreeIdAction(response.payload.id));
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
      //TODO: handle error
    }
  }

  return (
    <Box sx={mainContainerStyle}>
      <Typography variant='body1'><Trans>graph_mode_tree_intro</Trans></Typography>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {(props) => (
          <Grid2 container spacing={2} sx={gridContainerStyle}>
            <Grid2 size={6} >
              <form name="gen">
                <GenealogyForm treeCopy={treeCopy} setTreeCopy={setTreeCopy} storeImg={grabProfilePictureFile} />
              </form>
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
  position: 'relative'
};

const gridContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

export default GenealogyContainer;