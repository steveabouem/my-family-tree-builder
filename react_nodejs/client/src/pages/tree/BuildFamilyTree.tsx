import React, { ChangeEvent } from 'react';
import { Trans } from '@lingui/macro';
import Page from '../../components/common/Page';
import BuildFamilyTreeForm from './BuildFamilyTreeForm';
import FamilyTreeContext from 'contexts/creators/familyTree/familyTree.context';
import GlobalContext from 'contexts/creators/global/global.context';
import { Box, Typography, Paper } from '@mui/material';
import CustomField from 'components/common/forms/CustomField';

const BuildFamilyTree = (): JSX.Element => {
  const [numberOfSiblings, setNumberOfSiblings] = React.useState<number>(0);
  const [hasSpouse, setHasSpouse] = React.useState<boolean>(true);
  const { currentUser } = React.useContext(FamilyTreeContext);
  const { modal, updateModal, toggleLoading } = React.useContext(GlobalContext);

  React.useEffect(() => {
    if (toggleLoading) toggleLoading(false);
  }, []);

  React.useEffect(() => {
    if (hasSpouse && updateModal) {
      updateModal({
        ...modal,
        content: <Trans>added_spouse_fields</Trans>,
        hidden: false,
        buttons: { confirm: true, cancel: false }
      });
    }
  }, [hasSpouse]);

  const countSiblings = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) && Number(e.target.value) > 0) {
      setNumberOfSiblings(Number(e.target.value));
    } else {
      setNumberOfSiblings(0);
    }
  };

  const getMothersData = (e: ChangeEvent<HTMLInputElement>) => {
    return
  };

  return (
    <Page title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>}>
      <Box display="flex" flexDirection="column" gap={4}>
        <Paper sx={{ padding: "2rem" }}>
          <Typography variant="h3"><Trans>preliminary_build_tree_questions_title</Trans></Typography>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Box display="flex" justifyContent="start" flex="1" gap={2}>
              <Typography variant="subtitle1"><Trans>marital_status_question_label</Trans></Typography>
              <Typography variant="body1" aria-label="hasSpouse"><Trans>yes</Trans></Typography><input readOnly checked={!!hasSpouse} type="radio" onClick={() => setHasSpouse(true)} />
              <Typography variant="body1" aria-label="noSpouse"><Trans>no</Trans></Typography><input readOnly checked={!hasSpouse} type="radio" onClick={() => setHasSpouse(false)} />
            </Box>
            <Box display="flex" justifyContent="space-between" flex="1">
              <Typography><Trans>how_many_siblings</Trans></Typography>
              <CustomField type="number" min={0} onChange={countSiblings} />
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ padding: "2rem", display: "flex", flexDirection: "column", gap: 4 }} >
          <Typography variant="h3"><Trans>tell_me_more_about_your_family_title</Trans></Typography>
          <BuildFamilyTreeForm numberOfSiblings={numberOfSiblings} hasSpouse={hasSpouse} />
        </Paper>
      </Box>
    </Page>
  );
}

export default BuildFamilyTree;