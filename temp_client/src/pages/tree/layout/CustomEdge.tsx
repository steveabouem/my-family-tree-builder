import { Box } from '@mui/material';
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getBezierPath, getStraightPath } from '@xyflow/react';
import styled from 'styled-components';
import { CustomSimpleEdge } from 'types';
import { EyeIcon } from 'utils/assets/icons';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<CustomSimpleEdge>) => {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} amplitude={4} width={100} color='red' />
    </>
  );
};

export const SpouseEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<CustomSimpleEdge>) => {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <EyeIcon />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export const SiblingEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<CustomSimpleEdge>) => {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} amplitude={4} width={10} />
    </>
  );
};


export default CustomEdge;