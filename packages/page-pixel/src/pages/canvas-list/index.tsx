import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageLayout, PageHeader, PageMain } from '@patract/ui-components';
import { useApi } from '@patract/react-hooks';
import { Box, HStack, Icon, Center } from '@chakra-ui/react';
import MiniCanvas from './min-canvas';
import { FaPlusCircle } from 'react-icons/fa';

const CanvasList: React.FC = () => {
  const { api } = useApi();
  const history = useHistory();
  const canvasListBuffer = localStorage.getItem('canvas-list') || '[]';
  const canvasListArray = JSON.parse(canvasListBuffer);

  const hex2Canvas = (hex: string) => {
    const x = (api.registry as any)
      .createType('Vec<[u8; 160]>', hex)
      .toArray()
      .map((x: any) => {
        return [...x];
      });
    return x;
  };

  const createNew = () => {
    history.push('/paint');
  };

  return (
    <PageLayout>
      <PageHeader title='Patra Pixle' />
      <PageMain>
        <Center sx={{ mt: '18px' }}>
          <Box sx={{ w: '992px' }}>
            {canvasListArray.map((canvasHex: string, index: number) => (
              <Box
                key={index}
                sx={{
                  display: 'inline-block',
                  w: '320px',
                  h: '180px',
                  mr: (index + 1) % 3 === 0 ? '0' : '16px',
                  mb: '16px',
                  verticalAlign: 'top'
                }}
              >
                <MiniCanvas canvasObj={hex2Canvas(canvasHex)} />
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
      </PageMain>
    </PageLayout>
  );
};

export default CanvasList;
