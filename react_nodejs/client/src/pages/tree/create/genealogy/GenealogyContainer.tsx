import React, { useContext, useEffect } from 'react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import { AxiosResponse } from 'axios';
import GenealogyForm from './GenealogyForm';
import GenealogyNarrator from './GenealogyNarrator';
import FamilyTreeService from 'services/familyTree/familyTree.service';
import { DApiResponse, DFamilyMemberDTO, DFamilyTreeDAO } from 'services/api.definitions';
import FamilyTreeContext from 'contexts/creators/familyTree';
import { DFamilyTreeState, DStepFormState } from 'app/slices/definitions';
import { useZDispatch, useZSelector } from 'app/hooks';
import { DFamilyTreeDTO } from './definitions';
import { populateTreeAction } from 'app/slices/trees';
import GlobalContext from 'contexts/creators/global';

const GenealogyContainer: React.FC = () => {
  const { stepTree = {} } = useZSelector<DStepFormState>(state => state.stepForm);
  const dispatch = useZDispatch();
  const { currentUser } = useContext(FamilyTreeContext);
  const { updateModal, toggleLoading, modal, loading } = React.useContext(GlobalContext);


  useEffect(() => {
    const sample = {
      "e652a9cc-d234-46ea-8763-6f5f9ee8f251": {
        "id": 5,
        "dob": "2025-04-03",
        "node_id": "e652a9cc-d234-46ea-8763-6f5f9ee8f251",
        "email": "j@m.s",
        "first_name": "Josh",
        "gender": 1,
        "last_name": "Ham",
        "marital_status": "Married",
        "occupation": "",
        "parents": "\"\"",
        "siblings": "\"\"",
        "age": 0,
        "description": "",
        "profile_url": "",
        "children": "[{\"dob\":\"\",\"node_id\":\"6bc3d1e5-a863-4042-be7e-90f1dcc6fa8f\",\"email\":\"j@m.ssa\",\"first_name\":\"Jordanz\",\"gender\":1,\"last_name\":\"\",\"marital_status\":\"Married\",\"occupation\":\"\",\"parents\":\"\",\"siblings\":\"\",\"age\":\"\",\"description\":\"\",\"profile_url\":\"\",\"userId\":\"\"}]",
        "user_id": 0,
        "created_by": 1
      },
      "6f1c9a77-6bfb-4cdf-8669-cc06d4170c24": {
        "id": 6,
        "dob": "",
        "node_id": "6f1c9a77-6bfb-4cdf-8669-cc06d4170c24",
        "email": "j@m.ss",
        "first_name": "Jordan",
        "gender": 2,
        "last_name": "",
        "marital_status": "Widowed",
        "occupation": "",
        "parents": "\"\"",
        "siblings": "\"\"",
        "age": 0,
        "description": "",
        "profile_url": "",
        "children": "[{\"dob\":\"\",\"node_id\":\"6bc3d1e5-a863-4042-be7e-90f1dcc6fa8f\",\"email\":\"j@m.ssa\",\"first_name\":\"Jordanz\",\"gender\":1,\"last_name\":\"\",\"marital_status\":\"Married\",\"occupation\":\"\",\"parents\":\"\",\"siblings\":\"\",\"age\":\"\",\"description\":\"\",\"profile_url\":\"\",\"userId\":\"\"}]",
        "user_id": 0,
        "created_by": 1
      },
      "6bc3d1e5-a863-4042-be7e-90f1dcc6fa8f": {
        "id": 7,
        "dob": "",
        "node_id": "6bc3d1e5-a863-4042-be7e-90f1dcc6fa8f",
        "email": "j@m.ssa",
        "first_name": "Jordanz",
        "gender": 1,
        "last_name": "",
        "marital_status": "Married",
        "occupation": "",
        "parents": "\"\"",
        "siblings": "\"\"",
        "age": 0,
        "description": "",
        "profile_url": "",
        "user_id": 0,
        "created_by": 1
      }
    }
    //  handleSubmit(sample);

  }, [])
  //TODO: once you can create the initial unit, focus on adding kins to each node
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
      if (curr.includes('children')) {
        acc = {
          ...acc,
          // add current child to mother's children
          mother: {
            ...acc?.mother || {},
            children: [...acc?.mother?.children || [], formatted]
          },
          // add current child to faTther's children
          father: {
            ...acc?.father || {},
            children: [...acc?.father?.children || [], formatted]
          },
          // add current child's own DAO
          [curr]: { ...acc?.[curr] || {}, ...formatted }
        };
      } else if (curr.includes('mother')) {
        acc = { ...acc, mother: { ...acc?.mother || {}, ...formatted }, father: { ...acc?.father || {}, spouses: [formatted] } };
      } else if (curr.includes('father')) {
        acc = { ...acc, father: { ...acc?.father || {}, ...formatted }, mother: { ...acc?.mother || {}, spouses: [formatted] } };
      }

      return acc;
    }, {});
    return { members: mappedMembers, userId: currentUser?.userId || 0, treeName: '' };
  }
  function cleanUpValuesPrefixes(indicator: string, valuesObject: any): DFamilyMemberDTO {
    const formatted: DFamilyMemberDTO = {
      dob: valuesObject?.[`${indicator}_dob`] || '',
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
  function formatIncomingValues(v: any) {
    const formattedNodes = Object?.values(v || {})?.reduce((nodeList: any, member: any) => {
      let childrenIds: any = null;
      let siblingsIds: any = null;
      let spousesIds: any = null;
      if (member?.children) {
        if (Array.isArray(JSON.parse(member.children))) {
          childrenIds = JSON.parse(member.children).map((item: any) => item.node_id);
        }
      }
      if (member?.siblings) {
        if (Array.isArray(JSON.parse(member.siblings))) {
          siblingsIds = JSON.parse(member.siblings).map((item: any) => item.node_id);
        }
      }
      if (member?.spouses) {
        if (Array.isArray(JSON.parse(member.spouses))) {
          spousesIds = JSON.parse(member.spouses).map((item: any) => item.node_id);
        }
      }

      return ({
        ...nodeList,
        [member.node_id]: {
          ...member,
          id: member.node_id,
          children: childrenIds,
          siblings: siblingsIds,
          spouses: spousesIds,
        }
      })
    }, {});
    return formattedNodes;
  }
  function handleSubmit(v: any) {
    const familyTreeService = new FamilyTreeService();
    const formattedValues: DFamilyTreeDAO = formatOutgoingValues(v);

    familyTreeService.create(formattedValues).then((response: AxiosResponse<DApiResponse<DFamilyTreeDTO>>) => {
      if (response.data.code == 200) {
        const formattedMemberRecords = formatIncomingValues(response.data.members);
        if (updateModal) {
          updateModal({ hidden: false, content: <Typography variant='body2'>family_tree_save_success_modal</Typography>, type: 'success' });
        }
        dispatch(populateTreeAction(formattedMemberRecords));
      } else {
        if (updateModal) {
          updateModal({ hidden: false, content: <Typography variant='body2'>family_tree_save_failed_modal</Typography>, type: 'error' });
        }
      }
    })
      .catch((e: unknown) => {
        console.log('Failed to create tree', e);
      });
  }

  return (
    <Box width="100%">
      <Typography variant='body1'><Trans>graph_mode_tree_intro</Trans></Typography>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {(props) => (
          <Grid2 container spacing={2} display="flex" justifyContent="space-between">
            <Grid2 size={6} >
              <GenealogyForm />
            </Grid2>
            <Grid2 size={6}>
              <GenealogyNarrator />
            </Grid2>
          </Grid2>
        )}
      </Formik>
    </Box>
  );
};

export default GenealogyContainer;