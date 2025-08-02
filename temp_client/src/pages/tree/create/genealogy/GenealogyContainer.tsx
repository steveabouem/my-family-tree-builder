import React, { useContext, useState } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import { AxiosResponse } from 'axios';
import GenealogyForm from './GenealogyForm';
import TreePlayground from './GenealogyNarrator';
import { DApiResponse, DFamilyMemberDTO, DFamilyTreeDAO, DFamilyTreeRecord } from 'services/api.definitions';
import FamilyTreeContext from 'contexts/creators/familyTree';
import { DFamilyTreeState, DStepFormState, stepFormModes } from 'app/slices/definitions';
import { useZDispatch, useZSelector } from 'app/hooks';
import { DFamilyTreeDTO } from './definitions';
import { populateTreeAction, saveTreeIdAction } from 'app/slices/trees';
import GlobalContext from 'contexts/creators/global';
import { formatTreeMemberDAOList } from 'pages/tree/create/genealogy/utils';
import { addMembers, createFamilyTree } from 'services/familyTree';

const GenealogyContainer: React.FC = () => {
  const [treeCopy, setTreeCopy] = useState({});
  const { stepTree = {}, mode } = useZSelector<DStepFormState>(state => state.stepForm);
  const { treeId } = useZSelector<DFamilyTreeState>(state => state.tree);
  const dispatch = useZDispatch();
  const { currentUser } = useContext(FamilyTreeContext);
  const { updateModal } = React.useContext(GlobalContext);

  /*
  * At every step, the fiel names will be prefixed by the type of kin (fatherm, mother, children etc..)
  * We need to remove that prefix to match the DAO expected by the API
  * We will use the first part of the field name to determine if the field is a child or not
  * If it is a child, we will add it to the children object
  * each child step will follow the structure children-[x], where x is the step number
  * the API will handle creatig a family member from each of these steps
  */
  function formatOutgoingValues(v: any): DFamilyTreeDAO {
    const mappedMembers = Object.keys(stepTree).reduce((acc: any, curr: string) => {
      const formatted: DFamilyMemberDTO = cleanUpValuesPrefixes(curr, v);
      // TODO: back currently has a new currentAnchor prop to determine who among the members submitted should be the anchor
      if (!formatted?.node_id) {
        // TODO: this is to do a quick fix for key duplication when switching steps right after changing to edit mode and selecting a next of kin
        // the useEffect in the form attempts to generate the keys for the new kin, and somewhre along the way  we end up with brother and brother-[stepNumber], where brother has no values
        return acc;
      }

      const prefix = curr.split('-')[0];
      if (prefix === 'son' || prefix === 'daughter') {
        acc = {
          ...acc,
          // add current child to anchor's children
          anchor: {
            ...acc?.anchor || {},
            children: [...acc?.anchor?.children || [], formatted]
          },
        };
      } else if (prefix === 'brother' || prefix === 'sister') {
        acc = {
          ...acc,
          anchor: {
            ...acc?.anchor || {},
            siblings: [...acc?.anchor?.siblings || [], formatted]
          }
        };
      } else if (prefix === 'mother' || prefix === 'father') {
        acc = {
          ...acc,
          anchor: {
            ...acc?.anchor || {},
            parents: [...acc?.anchor?.parents || [], formatted]
          }
        };
      } else if (prefix === 'husband' || prefix === 'wife') {
        acc = {
          ...acc,
          anchor: {
            ...acc?.anchor || {},
            spouses: [...acc?.anchor?.spouses || [], formatted]
          }
        };
      } else {
        acc = { ...acc, [prefix]: formatted };
      }

      return acc;
    }, {});
    return { members: mappedMembers, userId: currentUser?.userId || 0, treeName: '' };
  }
  function cleanUpValuesPrefixes(indicator: string, valuesObject: any): DFamilyMemberDTO {
    const formatted: DFamilyMemberDTO = {
      dob: valuesObject?.[`${indicator}_dob`] || '',
      dod: valuesObject?.[`${indicator}_dod`] || '',
      node_id: valuesObject?.[`${indicator}_node_id`] || '',
      email: valuesObject?.[`${indicator}_email`] || '',
      first_name: valuesObject?.[`${indicator}_first_name`] || '',
      gender: valuesObject?.[`${indicator}_gender`] || '',
      last_name: valuesObject?.[`${indicator}_last_name`] || '',
      marital_status: valuesObject?.[`${indicator}_marital_status`] || '',
      occupation: valuesObject?.[`${indicator}_occupation`] || '',
      parents: valuesObject?.[`${indicator}_parents`] || '',
      siblings: valuesObject?.[`${indicator}_siblings`] || '',
      age: valuesObject?.[`${indicator}_age`] || '',
      description: valuesObject?.[`${indicator}_description`] || '',
      profile_url: valuesObject?.[`${indicator}_profile_url`] || '',
      userId: valuesObject?.[`${indicator}_userId`] || '',
    };

    return formatted;
  }
  
  function handleSubmit(v: any) {
    const formattedValues: DFamilyTreeDAO = formatOutgoingValues(v);

    try {
      if (mode === stepFormModes.edit) {
        addMembers({ ...formattedValues, treeId }).then((response: AxiosResponse<DApiResponse<{
          payload: DFamilyTreeRecord;
        }>, any>) => {
          if (response.data.code === 200) {
            const updatedListOfMembers = JSON.parse(response.data.payload.members);
            const formattedMemberRecords = formatTreeMemberDAOList(updatedListOfMembers);
            updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_success_modal</Trans></Typography>, type: 'success' });
            dispatch(populateTreeAction(formattedMemberRecords));
          } else {
            updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_update_failed_modal</Trans></Typography>, type: 'error' });
          }
        });
      } else {
        createFamilyTree(formattedValues).then((response: AxiosResponse<DApiResponse<DFamilyTreeDTO>>) => {
          if (response.data.code === 200) {
            const formattedMemberRecords: any = formatTreeMemberDAOList(response.data.members);
            updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_success_modal</Trans></Typography>, type: 'success' });
            dispatch(populateTreeAction(formattedMemberRecords));
            dispatch(saveTreeIdAction(response.data.id));
          } else {
            updateModal({ hidden: false, content: <Typography variant='body2'><Trans>family_tree_save_failed_modal</Trans></Typography>, type: 'error' });
          }
        });
      }
    } catch (e: unknown) {
      console.log('Failed to create tree', e);
    }
  }

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={2}>
      <Typography variant='body1'><Trans>graph_mode_tree_intro</Trans></Typography>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {(props) => (
          <Grid2 container spacing={2} display="flex" justifyContent="space-between">
            <Grid2 size={6} >
              <GenealogyForm treeCopy={treeCopy} setTreeCopy={setTreeCopy} />
            </Grid2>
            <Grid2 size={6}>
              <TreePlayground />
            </Grid2>
          </Grid2>
        )}
      </Formik>
    </Box>
  );
};

export default GenealogyContainer;