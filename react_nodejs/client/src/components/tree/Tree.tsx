import React, { ChangeEvent, ReactNode, useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import Page from '../common/Page';
import GlobalContext from '../../context/creators/global.context';
import ManageTreeForm from './ManageTreeForm';
import FamilyTreeContext from '../../context/creators/familyTree.context';
import service from '../../services';
import { DProfileProps } from '../user/definitions';

const Tree = ({ updateUser }: DProfileProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [numberOfSiblings, setNumberOfSiblings] = useState<number>(0);
  const [hasSpouse, setHasSpouse] = useState<boolean>(true);
  const { theme } = useContext(GlobalContext);
  const { currentUser } = useContext(FamilyTreeContext); // ! -TOFIX: this should even be done directly in the Page component

  useEffect(() => {
    // ! load anything you need
    setLoading(false);
  }, []);

  const countSiblings = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) && Number(e.target.value) > 0) {
      setNumberOfSiblings(Number(e.target.value));
    } else {
      setNumberOfSiblings(0);
    }
  };

  const getMotherData = (e: ChangeEvent<HTMLInputElement>) => {
    return
  };

  const submitForm = (values: any) => {
    const familyTreeService = new service.familyTre();
    familyTreeService.create(values)
      .then((data) => {
        console.log('TREE DONE? ', data);
      })
      .catch((e: unknown) => {
        console.log('Error loging in', e);
        return false;
      });
  };

  return (
    <Page title={<Trans>my_tree_page_title</Trans>} subtitle="Describe your Family" isLoading={loading} >
      <div className="row text-center">
        <div className="col">
          <label><Trans>marital_status_question_label</Trans></label>
          <label aria-label="hasSpouse"><Trans>yes</Trans></label><input type="radio" value='1' onClick={() => setHasSpouse(true)} />
          <label aria-label="noSpouse"><Trans>no</Trans></label><input type="radio" value='0' onClick={() => setHasSpouse(false)} />
        </div>
      </div>
      <div className="row text-center pb-4">
        <div className="col">
          <label><Trans>how_many_siblings</Trans></label>
          <input type="number" onChange={countSiblings} />
        </div>
      </div>

      <div className="row text-center pb-4">
        <ManageTreeForm numberOfSiblings={numberOfSiblings} hasSpouse={hasSpouse} />
      </div>
    </Page>
  );
}

export default Tree;