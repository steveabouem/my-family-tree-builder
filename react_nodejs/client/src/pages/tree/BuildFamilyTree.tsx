import React, { ChangeEvent } from 'react';
import { Trans } from '@lingui/macro';
import Page from '../common/Page';
import BuildFamilyTreeForm from './BuildFamilyTreeForm';
import FamilyTreeContext from 'contexts/creators/familyTree/familyTree.context';
import GlobalContext from 'contexts/creators/global/global.context';
import {  Box, Grid2, Typography } from '@mui/material';

const BuildFamilyTree = (): JSX.Element => {
  const [numberOfSiblings, setNumberOfSiblings] = React.useState<number>(0);
  const [hasSpouse, setHasSpouse] = React.useState<boolean>(true);
  const { currentUser } = React.useContext(FamilyTreeContext);
  const { modal, updateModal, toggleLoading } = React.useContext(GlobalContext);

  React.useEffect(() => {
    if(toggleLoading) toggleLoading(false);
  }, []);

  React.useEffect(() => {
    if (hasSpouse && updateModal) {
      updateModal({
        ...modal,
        content: <Trans>added_spouse_fields</Trans>,
        hidden: false,
        buttons: {confirm: true, cancel: false}
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
    <Page title={<Trans>my_tree_page_title</Trans>} subtitle="Describe your Family">
      <Box display="flex">
        <div>
          <label><Trans>marital_status_question_label</Trans></label>
          <Typography variant ="subtitle2" aria-label="hasSpouse"><Trans>yes</Trans></Typography><input readOnly checked={!!hasSpouse} type="radio" onClick={() => setHasSpouse(true)} />
          <Typography variant ="subtitle2" aria-label="noSpouse"><Trans>no</Trans></Typography><input readOnly checked={!hasSpouse} type="radio" onClick={() => setHasSpouse(false)} />
        </div>
      </Box>
      <div className="row text-center pb-4">
        <div>
          <Typography><Trans>how_many_siblings</Trans></Typography>
          <input type="number" onChange={countSiblings} />
        </div>
      </div>
      <div className="row text-center pb-4">
        <BuildFamilyTreeForm numberOfSiblings={numberOfSiblings} hasSpouse={hasSpouse} />
      </div>
    </Page>
  );
}

export default BuildFamilyTree;