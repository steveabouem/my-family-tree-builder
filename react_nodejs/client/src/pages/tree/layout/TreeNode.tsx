import React, { memo, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import Initials from 'components/common/Initials';
import { Gendersenum } from 'components/common/definitions';

export default memo(({ data }: any) => {
  const initialsBG = useMemo(() => {
    return data?.gender === Gendersenum.female ? '#fff8ef' : '##f2efff';
  }, [data?.gender]);

  return (
    <Box
      width="150px" height="90px" padding={1}
      display="flex" flexDirection="column" gap={1}
      justifyContent="start" alignItems="center" bgcolor="#fff8ef"
    >
      <Box display="flex" justifyContent="start" alignItems="center" gap={1} mr="auto">
        {
          !!data?.profile_url?.length ? <img src={data.profile_url} /> :
          <Initials firstName={data.first_name} lastName={data.last_name} bg={initialsBG} />
        }
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        isConnectable={true}
      />
      </Box>
      <Box display="flex" flexDirection="column" width="100%" overflow="hidden scroll" position="relative">
        <Typography variant='caption'>{data.first_name} {data.last_name}</Typography>
        <Typography variant='caption'>
          {data.age} <Trans>years_old</Trans>
        </Typography>
         <Typography variant='caption'>
          {data.description}
        </Typography>
      </Box>
    </Box>
  );
});