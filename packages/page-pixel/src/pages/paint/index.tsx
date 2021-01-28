import React, { useCallback, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { PageLayout, PageHeader, PageMain } from '@patract/ui-components';
import { Vec } from '@polkadot/types';
import { useApi } from '@patract/react-hooks';
import ToolBar from './tool-bar';
import Palette from './palette';
import Canvas from './canvas';
import { paletteColors } from './palette';

export type PaintMode = 'pen' | 'eraser';
export type Canvas = Array<Array<number>>;

export const HEIGHT_FIELD = 90;
export const WIDTH_FIELD = 160;
const emptyCanvasObj: Canvas = new Array(HEIGHT_FIELD).fill(0).map(() => new Array(WIDTH_FIELD).fill(0));
export let canvasObj: Canvas = emptyCanvasObj;
export let paintHistory: Array<string> = [JSON.stringify(emptyCanvasObj)];

const Paint: React.FC = () => {
  const [color, setColor] = useState(1);
  const pixelRef = useRef<HTMLSpanElement>(null);
  const [paintMode, setPaintMode] = useState<PaintMode>('pen');
  const { api } = useApi();
  const history = useHistory();

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

  const paintAll = () => {
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

  const onRefresh = useCallback(() => {
    let wantToClear = window.confirm('\nWARNING MESSAGE:\n\n' + 'Do you want to clear the design canvas?');
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
  }, []);

  const getPixel = useCallback(() => {
    if (pixelRef.current) {
      let pixels = 0;
      for (let yAxis = 0; yAxis < HEIGHT_FIELD; yAxis++) {
        for (let xAxis = 0; xAxis < WIDTH_FIELD; xAxis++) {
          if (canvasObj[yAxis][xAxis] !== 0) {
            pixels += 1;
          }
        }
      }
      pixelRef.current.innerText = pixels.toString();
    }
  }, [pixelRef]);

  const canvas2Hex = (obj: Canvas) => {
    const vector = new Vec(
      api.registry,
      (api.registry as any).createClass('[u8; 160]'),
      obj.map((x) => {
        return Uint8Array.from(x);
      })
    );
    return vector.toHex();
  };

  const savePaint = () => {
    const canvasListBuffer = localStorage.getItem('canvas-list') || '[]';
    const canvasListArray = JSON.parse(canvasListBuffer);
    canvasListArray.push(canvas2Hex(canvasObj));
    localStorage.setItem('canvas-list', JSON.stringify(canvasListArray));
    history.push('/list');
  };

  return (
    <PageLayout>
      <PageHeader title='Patra Pixle' />
      <PageMain>
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
              You have covered <span ref={pixelRef}>0</span> pixels
            </Text>
            <Button colorScheme='primary' sx={{ ml: '10px' }} onClick={savePaint}>
              Confirm
            </Button>
          </Box>
        </Box>
        <Canvas paintMode={paintMode} color={color} getPixel={getPixel} />
        <Box as='aside' aria-label='palette' sx={{ position: 'absolute', h: '100%', right: '0', top: '60px' }}>
          <Palette color={color} onColorChange={setColor} />
        </Box>
      </PageMain>
    </PageLayout>
  );
};

export default Paint;