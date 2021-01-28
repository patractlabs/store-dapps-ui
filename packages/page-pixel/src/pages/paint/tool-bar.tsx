import { Flex, Icon } from '@patract/ui-components';
import React from 'react';
import { FaEraser, FaPencilAlt, FaReply, FaUndoAlt } from 'react-icons/fa';
import { PaintMode } from './paint';

type ToolbarProps = {
  paintMode: PaintMode;
  onPenClick: () => void;
  onEraserClick: () => void;
  onRevert: () => void;
  onRefresh: () => void;
};

const ToolBar: React.FC<ToolbarProps> = ({ paintMode, onPenClick, onEraserClick, onRevert, onRefresh }) => {
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
      <Icon
        onClick={onPenClick}
        as={FaPencilAlt}
        sx={{
          w: '30px',
          h: '30px',
          color: `${paintMode === 'pen' ? `#FF7700` : '#ABB4D0'}`,
          cursor: 'pointer',
          _hover: { color: '#FF7700' }
        }}
      />
      <Icon
        onClick={onEraserClick}
        as={FaEraser}
        sx={{
          w: '30px',
          h: '30px',
          color: `${paintMode === 'eraser' ? `#FF7700` : '#ABB4D0'}`,
          cursor: 'pointer',
          _hover: { color: '#FF7700' }
        }}
      />
      <Icon
        onClick={onRevert}
        as={FaReply}
        sx={{ w: '30px', h: '30px', color: '#ABB4D0', cursor: 'pointer', _hover: { color: '#FF7700' } }}
      />
      <Icon
        onClick={onRefresh}
        as={FaUndoAlt}
        sx={{
          w: '30px',
          h: '30px',
          color: '#ABB4D0',
          transform: 'scaleX(-1)',
          cursor: 'pointer',
          _hover: { color: '#FF7700' }
        }}
      />
    </Flex>
  );
};

export default ToolBar;
