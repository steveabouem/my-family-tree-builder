import React from 'react';
import { useZSelector } from 'app/hooks';
import { DFamilyTreeState } from 'app/slices/definitions';
import TreeLayout from 'pages/tree/layout/TreeLayout';
import DataProgress from 'components/common/progressIndicators/DataProgress';
import { Trans } from '@lingui/macro';

export const TreePlayground = React.memo(() => {
  const { currentFamilyTree } = useZSelector<DFamilyTreeState>(state => state.tree);

  return currentFamilyTree ? (
    <TreeLayout tree={currentFamilyTree} />
  ) : <DataProgress
    msg={<Trans>fill_in_the_form_first</Trans>} />;
});

export default TreePlayground;