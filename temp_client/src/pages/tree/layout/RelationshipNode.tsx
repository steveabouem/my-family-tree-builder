import React from 'react';
import { Trans } from '@lingui/macro';
import { Handle, Position } from '@xyflow/react';
import styled from 'styled-components';
import BoxRow from 'components/common/containers/column';
import { treeNodeOffsetX, treeNodeWidth } from '../../constants';
import { FamilyMemberDTOV2, TreeNodeProps } from 'types';
import BoxColumn from 'components/common/containers/row/BoxColumn';

export const RelationshipNode = ({ data }: TreeNodeProps) => {
  if (!data?.sources) {
    return <></>;
  }

  const sources = data.sources as FamilyMemberDTOV2[];

  return (
    <>
      {sources.map((s: FamilyMemberDTOV2) => (
        <Handle
          key={`in-from-${s.id}`}
          type="target"
          id={`in-from-${s.id}`}
          position={Position.Top}
          style={{ background: 'transparent' }}
          isConnectable={true}
        />
      ))}
      <RelationNode>
        <Trans>{sources.map(s => s.first_name).join(' & ')}_children</Trans>
      </RelationNode>
      <Handle
        type="source"
        id="out-to-gl"
        position={Position.Bottom}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
    </>
  );
}

export const GenerationLayerNode = ({ data }: { data?: Record<string, unknown> }) => {
  const childIds = (data?.childIds as number[] | undefined) ?? [];

  return (
    <>
      <ChildrenDivider siglingsCount={childIds.length}>
        <Handle
          type="target"
          id="in-from-rel"
          position={Position.Top}
          style={{ background: 'transparent' }}
          isConnectable
        />
        <IntersectionLabel>
          <Trans>children</Trans>
        </IntersectionLabel>
        {childIds.map(cid => (
          <Handle
            key={`out-to-child-${cid}`}
            type="source"
            id={`out-to-child-${cid}`}
            position={Position.Top}
            style={{ background: 'transparent' }}
            isConnectable
          />
        ))}
      </ChildrenDivider>
    </>
  );
};

export const RelationshipSeparatorEdge = (data: { count: number }) => {
  return <BoxRow sx={{ width: `${data.count * treeNodeWidth}px` }}>______edge here______</BoxRow>
}

const RelationNode = styled(BoxColumn)`
  height: 15px;
  overflow: hidden;
  width: 150px;
  border-radius: 200px;
  background: orange;
  color: white;
  border: none;
`;

const ChildrenDivider = styled.div<{ siglingsCount: number }>`
  width: ${(props: any) => `${props.siglingsCount * (treeNodeWidth)}px`};
  height: 35px;
  border-top: 3px solid #555;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: start;
`;

const IntersectionLabel = styled.div`
  background: white;
  width: ${treeNodeWidth}px;
  color: black;
  text-align: center;
  border-radius: 5px;
`;