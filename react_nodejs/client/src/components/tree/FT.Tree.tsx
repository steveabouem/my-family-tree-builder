import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Page from '../common/Page';
import GlobalContext from '../../context/global.context';
import ManageTreeForm from './FT.ManageTreeForm';
import { useNavigate } from 'react-router';
import FamilyTreeContext from '../../context/familyTree.context';
import FTSessionService from '../../services/FT/session/session.service';
import { DProfileProps } from '../user/definitions';
import useAuthValidation from '../hooks/useAuthValidation';

const FTTree = ({ updateUser }: DProfileProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasSiblings, setHasSiblings] = useState<boolean>(true);
  const [hasSpouse, setHasSpouse] = useState<boolean>(true);
  const { theme } = useContext(GlobalContext);
  const { currentUser } = useContext(FamilyTreeContext); // TODO: this should even be done directly in the Page component

  const countSiblings = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) && Number(e.target.value) > 0) {
      setHasSiblings(true);
    } else {
      setHasSiblings(false);
    }
  }

  const getMotherData = (e: ChangeEvent<HTMLInputElement>) => {
    return 
  }

  return (
    <Page title="My Family Tree" subtitle="Describe your Family" isLoading={loading} theme={theme} >
      <div className="row text-center">
        <div className="col">
          <label>Do you have a spouse/partner?</label>
          <label aria-label="hasSpouse">Yes</label><input type="radio" value='1' onClick={() => setHasSpouse(true)} />
          <label aria-label="noSpouse">No</label><input type="radio" value='0' onClick={() => setHasSpouse(false)} />
        </div>
      </div>
      <div className="row text-center pb-4">
        <div className="col">
          <label>How many siblings do you have?</label>
          <input type="number" onChange={countSiblings} />
        </div>
      </div>
      <div className="row text-center pb-4">
        <div className="col">
          <label>What is your mother's full name?</label>
          {/* TODO: use 2 inputs first/last */}
          <input name="mothers_name" onChange={getMotherData} />
        </div>
      </div>
      <ManageTreeForm hasSiblings={hasSiblings} hasSpouse={hasSpouse} />
    </Page>
  )
}

export default FTTree;