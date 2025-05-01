import React from 'react';
import { useZSelector } from 'app/hooks';
import { DFamilyTreeState } from 'app/slices/definitions';
import TreeLayout from 'pages/tree/layout/TreeLayout';
import DataProgress from 'components/common/progressIndicators/DataProgress';
import abstractLogo from 'utils/assets/images/abstract_logo.png';
import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';

export const GenealogyNarrator = () => {
  const { currentFamilyTree } = useZSelector<DFamilyTreeState>(state => state.tree);

  return currentFamilyTree ? (
    <TreeLayout tree={currentFamilyTree} />
    // ) : <DataProgress bg={<FamilyTreeIcon color='#e0e0e0' size={250} sx={{opacity: '.25'}} />} />;
  ) : <DataProgress
    msg={<Trans>fill_in_the_form_first</Trans>}
    bg={abstractLogo}
  />;
};

export default GenealogyNarrator;