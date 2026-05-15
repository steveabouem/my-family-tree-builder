import React from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import { FamilyTreeBuilderForm } from './FamilyTreeBuilderForm';
import { FamilyTreeDAOV2, MemberVisibility, TreeVisibility } from 'types';
import GlobalContext from 'contexts/creators/global';
import GenealogyTree from 'pages/tree/layout/GenealogyTree';
import { useCreateFamilyTree } from 'api';
import { useNavigate } from 'react-router';
import PageUrls from 'utils/urls';

export const FamilyTreeBuilderContainer: React.FC = () => {
  const { updateModal } = React.useContext(GlobalContext);
  const { mutate: createFamilyTreeMutation, error, isPending } = useCreateFamilyTree();
  const navigate = useNavigate();
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
      // make a map of siblings and parents. Whenever a member has siblings and parents, use the map to quickly get each sibling and fill their parents array with the same
      //! PROBLEM: in case of famille recomposee, this is not workable. What Can I do?
      const membersFromForm = Object.values(v.members);
      const membersMap = new Map(membersFromForm.map(m => [m.node_id, m]));

      membersFromForm.forEach(m => {
        if (m?.siblings?.length && m?.parents?.length) {
          m.siblings.forEach(s => {
            const sib = membersMap.get(s);
            if (sib) {
              sib.parents = m.parents;
              //@ts-ignore
              m.parents.forEach(parentId => {
                const parent = membersMap.get(parentId);
                if (parent && !parent.children?.includes(sib.node_id)) {
                  parent.children = [...(parent.children || []), sib.node_id];
                }
              });
            }
          });
        }
      });

      createFamilyTreeMutation(
        // @ts-ignore: quick update of payload type needed. its an array
        {...v, members: membersFromForm},
        {
          onSuccess: (response) => {
            if (response.code == 200) {
              updateModal({
                hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_success_modal</Trans></Typography>, type: 'success', buttons: {
                  confirm: true, cancel: false, confirmText: <Trans>go_to_my_tree</Trans>
                }, onConfirm: () => !!response.payload?.tree?.id ? navigate(PageUrls.viewTree.replace(':id', `${response.payload.tree.id}`)) : null
              });
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
          <Grid2 container spacing={2} sx={{gridContainerStyle}}>
            <Grid2 size={6} >
              <form name="gen">
                <FamilyTreeBuilderForm storeImg={grabProfilePictureFile} />
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