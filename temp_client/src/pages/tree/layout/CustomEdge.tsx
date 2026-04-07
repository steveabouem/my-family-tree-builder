import { BaseEdge, Edge, EdgeProps, getBezierPath, getStraightPath } from '@xyflow/react';

type CustomSimpleEdge = Edge<{ value: number }, 'custom'>;
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
    <BaseEdge id={id} path={edgePath} amplitude={4} width={10} color='red'/>
</>
);
};

export default CustomEdge;