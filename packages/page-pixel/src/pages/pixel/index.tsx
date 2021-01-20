import React, { useCallback, useState } from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import Layout from '../../components/layout';
import ToolBar from './tool-bar';
import Palette from './palette';
import Canvas from './canvas';
import { paletteColors } from './palette';

export type PaintMode = 'pen' | 'eraser';
export type Canvas = Array<Array<number>>;

const HEIGHT_FIELD = 90;
const WIDTH_FIELD = 160;
const emptyCanvasObj: Canvas = new Array(HEIGHT_FIELD).fill(0).map(() => new Array(WIDTH_FIELD).fill(0));
export let canvasObj: Canvas = emptyCanvasObj;
export let paintHistory: Array<string> = [JSON.stringify(emptyCanvasObj)];

const Pixel: React.FC = () => {
  const [color, setColor] = useState(1);
  const [paintMode, setPaintMode] = useState<PaintMode>('pen');

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
      paintHistory = [JSON.stringify(emptyCanvasObj)];;
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

  return (
    <Layout>
      <Box sx={{ position: 'absolute', mt: '42px' }}>
        <Text sx={{ color: 'brand.grey' }}>1 Pixel = 1 DOT</Text>
        <Text sx={{ color: 'brand.primary' }}>Pool ：567 DOT</Text>
      </Box>
      <Center sx={{ display: 'inline-flex', w: '100%', m: '42px 0 34px' }}>
        <ToolBar
          paintMode={paintMode}
          onPenClick={onPenClick}
          onEraserClick={onEraserClick}
          onRevert={onRevert}
          onRefresh={onRefresh}
        />
      </Center>
      <Canvas paintMode={paintMode} color={color} />
      <Box as='aside' aria-label='palette' sx={{ position: 'absolute', h: '100%', right: '0', top: '0' }}>
        <Palette color={color} onColorChange={setColor} />
      </Box>
    </Layout>
  );
};

export default Pixel;
