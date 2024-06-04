import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import Page from '../common/Page';
import GlobalContext from '../../context/creators/global.context';
import BuildFamilyTreeForm from './BuildFamilyTreeForm';
import FamilyTreeContext from '../../context/creators/familyTree.context';
import {service} from '../../services';

const BuildFamilyTree = (): JSX.Element => {
  const [numberOfSiblings, setNumberOfSiblings] = React.useState<number>(0);
  const [hasSpouse, setHasSpouse] = React.useState<boolean>(true);
  const { currentUser } = React.useContext(FamilyTreeContext);
  const { modal, updateModal, toggleLoading } = React.useContext(GlobalContext);

  React.useEffect(() => {
    // const getFamilyTrees =  async() => {
    //   if (currentUser?.userId) {
    //     const familyTreeService = new service.familyTree();
    //     const userFamilies = await familyTreeService.getAllForUser(currentUser.userId);
    //     console.log({userFamilies});
    //   }
    // };

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
      <div className="row text-center">
        <div className="col">
          <label><Trans>marital_status_question_label</Trans></label>
          <label aria-label="hasSpouse"><Trans>yes</Trans></label><input readOnly checked={!!hasSpouse} type="radio" onClick={() => setHasSpouse(true)} />
          <label aria-label="noSpouse"><Trans>no</Trans></label><input readOnly checked={!hasSpouse} type="radio" onClick={() => setHasSpouse(false)} />
        </div>
      </div>
      <div className="row text-center pb-4">
        <div className="col">
          <label><Trans>how_many_siblings</Trans></label>
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