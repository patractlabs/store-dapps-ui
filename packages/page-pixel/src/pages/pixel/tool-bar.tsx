import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { FaPencilAlt, FaEraser, FaReply, FaUndoAlt } from 'react-icons/fa';

const ToolBar: React.FC = () => {
  return (
    <Flex
      sx={{
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '345px',
        height: '50px',
        background: '#FFFFFF',
        borderRadius: '8px'
      }}
    >
      <Icon as={FaPencilAlt} sx={{ w: '30px', h: '30px', color: '#ABB4D0', cursor: 'pointer' }} />
      <Icon as={FaEraser} sx={{ w: '30px', h: '30px', color: '#ABB4D0', cursor: 'pointer' }} />
      <Icon as={FaReply} sx={{ w: '30px', h: '30px', color: '#ABB4D0', cursor: 'pointer' }} />
      <Icon
        as={FaUndoAlt}
        sx={{ w: '30px', h: '30px', color: '#ABB4D0', transform: 'scaleX(-1)', cursor: 'pointer' }}
      />
    </Flex>
  );
};

export default ToolBar;
