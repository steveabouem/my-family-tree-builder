import React from 'react';
import { Trans } from '@lingui/macro';
import { Handle, Position } from '@xyflow/react';
import styled from 'styled-components';
import BoxRow from 'components/common/containers/column';
import { treeNodeWidth } from '../../constants';
import {  FamilyMemberDTOV2, TreeNodeProps } from 'types';
import BoxColumn from 'components/common/containers/row/BoxColumn';

export const RelationshipNode = ({data}: TreeNodeProps) => {
  if (!data?.sources) {
    return <></>;
  }

  const names: string[] = data.sources.map((s: FamilyMemberDTOV2) => s.first_name);
  console.log({names, data});
  
  const label = names.reduce((n: string, l: string, i: number) => {
    if (i < l.length - 1) {
      return l += `, ${n}`;
    }

    return l += `and ${n}`
  }, '');

  return (
    <>
      <Handle
        type="source"
        id={`${label}-source`}
        position={Position.Bottom}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
      <RelationNode sx={{background: 'red', borderRadius: 200, height: 55, width: 155, }}><Trans>{label} children_label</Trans></RelationNode>
      <Handle
        type="target"
        id={`${label}-target`}
        position={Position.Bottom}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
    </>
  )
}

export const RelationshipSeparatorEdge = (data: { count: number }) => {
  return <BoxRow sx={{ width: `${data.count * treeNodeWidth}px` }}>______edge here______</BoxRow>
}

const RelationNode = styled(BoxColumn)`
  height: 55px;
  width: 150px;
  border-radius: 200px;
  background: black;
  color: white;
  border: none;
  
`;