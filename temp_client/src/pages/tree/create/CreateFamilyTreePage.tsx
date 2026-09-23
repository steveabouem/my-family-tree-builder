import React, { useContext, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';
import { useCreateFamilyTree } from 'api';
import { useZDispatch } from 'app/hooks';
import { resetAction } from 'app/slices/trees';
import PaperSection from 'components/common/containers/PaperSection';
import { FamilyTreeBuilderContainer } from './builder/FamilyTreeBuilderContainer';
import { FamilyMemberDAOV2, FamilyTreeDAOV2, MemberVisibility, TreeVisibility } from 'types';
import { Formik } from 'formik';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import PageUrls from 'utils/urls';

const CreateFamilyTreePage = (): JSX.Element => {
  const { loading, toggleLoading, updateModal } = useContext(GlobalContext);
  const { isPending: isCreateTreePending, mutateAsync: createFamilyTreeMutation } = useCreateFamilyTree();
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const isProcessing = loading || isCreateTreePending;
  const initialValues: any = {
    active: false,
    default_generation_depth: 3,
    visibility: TreeVisibility.invite_only,
    name: '',
    members: {
      // anchor: {
      //   deceased: false,
      //   description: null,
      //   dob: '',
      //   dod: '',
      //   email: '',
      //   first_name: '',
      //   gender: null,
      //   last_name: '',
      //   marital_status: '',
      //   node_id: '',
      //   occupation: '',
      //   is_anchor: false,
      //   profile_url: '',
      //   visibility: MemberVisibility.private,
      //   send_invite: false,
      //   parents: [],
      //   siblings: [],
      //   spouses: [],
      //   children: [],
      //   step_number: 0
      // }
    }
  };
  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
    dispatch(resetAction(undefined))
  }, []);

  function handleSubmit(v: FamilyTreeDAOV2) {
    try {
      // make a map of siblings and parents. Whenever a member has siblings and parents, use the map to quickly get each sibling and fill their parents array with the same
      const membersFromForm = Object.values(v.members);
      const membersMap = new Map(membersFromForm.map(m => [m.node_id, m]));

      membersFromForm.forEach(m => {
        if (m?.siblings?.length && m?.parents?.length) {
          m.siblings.forEach((s: {node_id: string, shared_parent?: string}) => {
            const sib = membersMap.get(s.node_id);
            if (sib) {
              sib.parents = m.parents;
              m?.parents?.forEach(parentId => {
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
        { ...v, members: membersFromForm },
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
    <Page
      loading={isProcessing}
      title={<Trans>my_tree_page_title</Trans>}
      subtitle={<Trans>manage_your_family_tree</Trans>}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => <FamilyTreeBuilderContainer />}
      </Formik>
    </Page>
  );
}

export default CreateFamilyTreePage;