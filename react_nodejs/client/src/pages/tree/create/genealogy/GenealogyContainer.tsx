import React, { useContext } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import GenealogyForm from './GenealogyForm';
import GenealogyNarrator from './GenealogyNarrator';
import FamilyTreeService from 'services/familyTree/familyTree.service';
import { DFamilyTreeDAO } from 'services/api.definitions';
import FamilyTreeContext from 'contexts/creators/familyTree';

const GenealogyContainer: React.FC = () => {
  const { currentUser } = useContext(FamilyTreeContext);
  /*
  * At every step, the fiel names will be prefixed by the type of kin (fatherm, mother, children etc..)
  * We need to remove that prefix to match the DAO expected by the API
  * We will use the first part of the field name to determine if the field is a child or not
  * If it is a child, we will add it to the children object
  * each child step will follow the structure children-[x], where x is the step number
  * the API will handle creatig a family member from each of these steps
  */
  function formatOutgoingValues(v: any): DFamilyTreeDAO {
    const payload = Object.keys(v).reduce((acc: any, curr: any) => {
      const prefix = curr.split('_')[0];
      const suffix = curr.split('_').slice(1).join('_');
      acc[prefix] = { ...acc?.[prefix] || {}, [suffix]: v[curr] };

      return acc;
    }, {});
    return { ...payload, userId: currentUser?.userId || 0 };
  }
  function handleSubmit(v: any) {
    const familyTreeService = new FamilyTreeService();
    const formattedValues: DFamilyTreeDAO = formatOutgoingValues(v);

    familyTreeService.create(formattedValues).then((response: any) => {
      console.log({ response });
    });
  }

  return (
    <Box width="100%">
      <Typography variant='body1'><Trans>story_mode_tree_intro</Trans></Typography>
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
}

export default GenealogyContainer;