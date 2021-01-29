import { Box, Center, Icon } from '@chakra-ui/react';
import { useApi } from '@patract/react-hooks';
import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { usePixelHistroy } from '../../hooks/use-pixel-histroy';

import { hex2Canvas } from '../../utils';
import MiniCanvas from './min-canvas';

export const CanvasList: React.FC = () => {
  const { api } = useApi();
  const history = useHistory();
  const result = usePixelHistroy();

  const canvasListArray = result;

  const createNew = () => {
    history.push('/paint');
  };

  const editPaint = (index: number) => {
    history.push(`/paint/${index}`);
  };

  return (
    <Center sx={{ mt: '18px' }}>
      <Box sx={{ w: '992px' }}>
        {canvasListArray.map(({ value, id }) => (
          <Box
            key={id}
            onClick={editPaint.bind(null, id)}
            sx={{
              display: 'inline-block',
              w: '320px',
              h: '180px',
              mr: (id + 1) % 3 === 0 ? '0' : '16px',
              mb: '16px',
              verticalAlign: 'top',
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'gray.300',
              _hover: {
                borderColor: 'gray.500'
              }
            }}
          >
            <MiniCanvas canvasObj={hex2Canvas(api.registry, value)} />
          </Box>
        ))}
        <Box
          sx={{
            display: 'inline-block',
            w: '320px',
            h: '180px',
            borderRadius: '8px',
            border: '1px dashed',
            borderColor: 'gray.300',
            verticalAlign: 'top',
            _hover: { borderColor: 'gray.500' }
          }}
        >
          <Center
            sx={{ h: '100%', color: 'gray.300', cursor: 'pointer', _hover: { color: 'gray.500' } }}
            onClick={createNew}
          >
            <Icon as={FaPlusCircle} boxSize={10} />
          </Center>
        </Box>
      </Box>
    </Center>
  );
};
