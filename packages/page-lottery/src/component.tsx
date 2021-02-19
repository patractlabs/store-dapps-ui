import React from 'react';
import { Box } from '@patract/ui-components';

export const Circle: React.FC<{ v: number; fade?: boolean }> = ({ v, fade = false }) => {
  return (
    <Box
      mr='3px'
      height='25px'
      width='25px'
      rounded='2em'
      bg={
        fade
          ? 'linear-gradient(180deg, #F3F6F9 0 %, #E4E8F5 100 %);'
          : 'linear-gradient(180deg, #FFDA00 0%, #FF5C00 100%);'
      }
      textAlign='center'
    >
      {v}
    </Box>
  );
};
