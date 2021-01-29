import { SignMessageModal } from '@patract/react-components';
import { useApi, useModal } from '@patract/react-hooks';
import { Box, Button, Center, Spinner, Text } from '@patract/ui-components';
import React, { useCallback, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { usePixelContract } from '../../hooks/use-pixel-contract';
import { canvas2Hex } from '../../utils';
import Canvas from './canvas';
import Palette, { paletteColors } from './palette';
import ToolBar from './tool-bar';

export type PaintMode = 'pen' | 'eraser';
export type Canvas = Array<Array<number>>;

export const HEIGHT_FIELD = 90;
export const WIDTH_FIELD = 160;
const emptyCanvasObj: Canvas = new Array(HEIGHT_FIELD).fill(0).map(() => new Array(WIDTH_FIELD).fill(0));
export let canvasObj: Canvas = emptyCanvasObj;
export let paintHistory: Array<string> = [JSON.stringify(emptyCanvasObj)];

export const paintAll = () => {
  for (let yAxis = 0; yAxis < HEIGHT_FIELD; yAxis++) {
    for (let xAxis = 0; xAxis < WIDTH_FIELD; xAxis++) {
      const cellNode = document.getElementById(`${yAxis}-${xAxis}`);
      if (cellNode) {
        const color = canvasObj[yAxis][xAxis];
        if (cellNode.style.backgroundColor !== paletteColors[color]) {
          cellNode.style.backgroundColor = paletteColors[color];
        }
      }
    }
  }
};

export const paintCanvas = (obj: Canvas) => {
  canvasObj = obj;
  paintAll();
};

export const Paint: React.FC = () => {
  const { editingId } = useParams<{ editingId: string }>();
  const [color, setColor] = useState(1);
  const [pixels, setPixels] = useState(0);
  const pixelRef = useRef<HTMLSpanElement>(null);
  const [paintMode, setPaintMode] = useState<PaintMode>('pen');
  const { api } = useApi();
  const history = useHistory();
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<any>(null);
  const isEditing = typeof Number(editingId) === 'number';
  const { contract } = usePixelContract();
  const { isOpen, onOpen, onClose } = useModal();

  const onPenClick = () => {
    setPaintMode('pen');
  };

  const onEraserClick = () => {
    setPaintMode('eraser');
  };

  const onRevert = () => {
    if (paintHistory.length > 1) {
      paintHistory.pop();
      const snapshot = paintHistory[paintHistory.length - 1];
      canvasObj = JSON.parse(snapshot);
      getPixel();
      paintAll();
    }
  };

  const getPixel = useCallback(() => {
    let pixels = 0;
    for (let yAxis = 0; yAxis < HEIGHT_FIELD; yAxis++) {
      for (let xAxis = 0; xAxis < WIDTH_FIELD; xAxis++) {
        if (canvasObj[yAxis][xAxis] !== 0) {
          pixels += 1;
        }
      }
    }
    setPixels(pixels);
  }, []);

  const onRefresh = useCallback(() => {
    const wantToClear = window.confirm('\nWARNING MESSAGE:\n\nDo you want to clear the design canvas?');
    if (wantToClear) {
      canvasObj = emptyCanvasObj;
      getPixel();
      paintHistory = [JSON.stringify(emptyCanvasObj)];
      const TDS = document.querySelectorAll('td');
      for (let i = 0, length = TDS.length; i < length; i++) {
        let td = TDS[i];
        if ((td.style.backgroundColor = '')) {
          continue;
        }
        td.style.backgroundColor = '';
      }
    } else {
      return;
    }
  }, [getPixel]);

  const submit = () => {
    try {
      const data = canvas2Hex(api.registry, canvasObj);
      setFields([
        {
          label: 'Pixels',
          content: pixels,
          value: data
        }
      ]);
      onOpen();
    } catch {
      setFields(null);
    }
  };

  const onSubmit = () => {
    onClose();
    setFields(null);
    history.push('/list');
  };

  const onCancel = () => {
    onClose();
    setFields(null);
  };

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <Center sx={{ display: 'inline-flex', w: '100%', m: '18px 0 34px' }}>
          <ToolBar
            paintMode={paintMode}
            onPenClick={onPenClick}
            onEraserClick={onEraserClick}
            onRevert={onRevert}
            onRefresh={onRefresh}
          />
        </Center>
        <Box sx={{ position: 'absolute', right: '0', top: '26px' }}>
          <Text color='orange.400' sx={{ display: 'inline-block' }}>
            You have covered {pixels} pixels
          </Text>
          <Button colorScheme='primary' sx={{ ml: '10px' }} onClick={submit}>
            {saving ? <Spinner size='sm' color='white' /> : 'Submit'}
          </Button>
        </Box>
      </Box>
      <Canvas paintMode={paintMode} color={color} getPixel={getPixel} editingId={Number(editingId)} />
      <Box as='aside' aria-label='palette' sx={{ position: 'absolute', h: '100%', right: '0', top: '60px' }}>
        <Palette color={color} onColorChange={setColor} />
      </Box>
      <SignMessageModal
        fields={fields || []}
        isOpen={isOpen}
        method={'mintWithMetadata'}
        title={'Confrim Pixel'}
        contract={contract}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Box>
  );
};