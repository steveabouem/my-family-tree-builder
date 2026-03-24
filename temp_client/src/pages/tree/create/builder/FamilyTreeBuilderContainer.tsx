import React, { useState } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import { FamilyTreeBuilderForm } from './FamilyTreeBuilderForm';
import {  StepFormState,  FamilyTreeDAOV2, MemberVisibility, TreeVisibility } from 'types';
import { useZDispatch, useZSelector } from 'app/hooks';
import { populateTreeAction, saveTreeIdAction } from 'app/slices/trees';
import GlobalContext from 'contexts/creators/global';
import GenealogyTree from 'pages/tree/layout/GenealogyTree';
import { useAddMembers, useCreateFamilyTree } from 'api';

export const FamilyTreeBuilderContainer: React.FC = () => {
  // treeCopy is used to keep copy of the tree through all events.
  // for instance, updating a member requires to rerender the form with only that member's fields.
  // the copy allows for the other existing members to remain rendered in the graph
  const [treeCopy, setTreeCopy] = useState({});
  const {  mode } = useZSelector<StepFormState>(state => state.stepForm);
  const dispatch = useZDispatch();
  const { updateModal } = React.useContext(GlobalContext);
  const { mutate: createFamilyTreeMutation, error: createActionError, isPending: isCreateActionPending } = useCreateFamilyTree();
  const initialValues: FamilyTreeDAOV2 = {
    active: false,
    default_generation_depth: 3,
    visibility: TreeVisibility.invite_only,
    name: '',
    members: {
      anchor: {
        deceased: false,
        description: null,
        dob: '',
        dod: '',
        email: '',
        first_name: '',
        gender: null,
        last_name: '',
        marital_status: '',
        node_id: '',
        occupation: '',
        is_anchor: false,
        profile_url: '',
        visibility: MemberVisibility.private,
        send_invite: false,
        parents: [],
        siblings: [],
        spouses: [],
        children: [],
        step_number: 0
      }
    }
  };

  function grabProfilePictureFile(f: any) {
    console.log('file', f);

  }
  function handleSubmit(v: FamilyTreeDAOV2) {
    try {
        createFamilyTreeMutation(
          v,
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
              console.log('Failed to create tree:', error);
              updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_failed_modal</Trans></Typography>, type: 'error' });
            }
          }
        );
    } catch (e: unknown) {
      //TODO: handle error
    }
  }

  return (
    <Box sx={mainContainerStyle}>
      <Typography variant='body1'><Trans>graph_mode_tree_intro</Trans></Typography>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(props) => (
          <Grid2 container spacing={2} sx={gridContainerStyle}>
            <Grid2 size={6} >
              <form name="gen">
                <FamilyTreeBuilderForm treeCopy={treeCopy} setTreeCopy={setTreeCopy} storeImg={grabProfilePictureFile} />
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