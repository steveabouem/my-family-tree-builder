import { Box } from '@mui/material';
import { BaseEdge, Edge, EdgeProps, getBezierPath, getStraightPath } from '@xyflow/react';
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
      <BaseEdge id={id} path={edgePath} amplitude={4} width={10} color='red' />
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
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} amplitude={4} width={10} />
      {/* <foreignObject
        x={sourceX - 10}
        y={sourceY - 10}
        width={20}
        height={20}
        style={{ overflow: 'visible' }}
      >
       <EyeIcon />
      </foreignObject> */}
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
       <foreignObject
        x={sourceX - 10}
        y={sourceY - 5}
        width={20}
        height={20}
        style={{ overflow: 'visible' }}
      >
       <EyeIcon />
      </foreignObject>
    </>
  );
};


export default CustomEdge;