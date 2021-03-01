import { SignMessageModal } from '@patract/react-components';
import { useAccount, useApi, useModal } from '@patract/react-hooks';
import { Box, Button, Center, Spinner, Text, Fixed, Stack } from '@patract/ui-components';
import { useContractTx, useBalance } from '@patract/react-hooks';
import { parseAmount } from '@patract/utils';
import React, { useCallback, useRef, useState, useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePixelContract } from '../../hooks/use-pixel-contract';
import { usePixelDetail } from '../../hooks/use-pixel-detail';
import { usePixelPool } from '../../hooks/use-pixel-pool';
import Canvas from './canvas';
import Palette, { paletteColors } from './palette';
import ToolBar from './tool-bar';

export type PaintMode = 'pen' | 'eraser';
export type Canvas = Array<Array<number>>;

export const HEIGHT_FIELD = 180;
export const WIDTH_FIELD = 320;
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
  const { currentAccount } = useAccount();
  const balance = useBalance(currentAccount);
  const [color, setColor] = useState(1);
  const [pixels, setPixels] = useState(0);
  const pixelRef = useRef<HTMLSpanElement>(null);
  const [paintMode, setPaintMode] = useState<PaintMode>('pen');
  const { api } = useApi();
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [fields, setFields] = useState<any>(null);
  const isEditing = typeof Number(editingId) === 'number';
  const { contract } = usePixelContract();
  const pool = usePixelPool();
  const { isOpen, onOpen, onClose } = useModal();
  const { excute } = useContractTx({ title: 'Pixel', contract, method: 'update' });
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);
  const data = usePixelDetail(signal);

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
    if (!data) {
      setPixels(0);
    } else {
      let pixels = 0;
      for (let yAxis = 0; yAxis < HEIGHT_FIELD; yAxis++) {
        for (let xAxis = 0; xAxis < WIDTH_FIELD; xAxis++) {
          if (canvasObj[yAxis][xAxis] !== data[yAxis][xAxis]) {
            pixels += 1;
          }
        }
      }
      setPixels(pixels);
    }
  }, [data]);

  const onRefresh = useCallback(() => {
    const wantToClear = window.confirm('\nWARNING MESSAGE:\n\nDo you want to clear your drawing?');
    if (wantToClear) {
      const snapshot = paintHistory[0] || JSON.stringify(emptyCanvasObj);
      paintHistory = [JSON.stringify(emptyCanvasObj)];
      canvasObj = JSON.parse(snapshot);

      getPixel();
      paintAll();

      // canvasObj = emptyCanvasObj;
      // getPixel();
      // const TDS = document.querySelectorAll('td');
      // for (let i = 0, length = TDS.length; i < length; i++) {
      //   let td = TDS[i];
      //   if ((td.style.backgroundColor = '')) {
      //     continue;
      //   }
      //   td.style.backgroundColor = '';
      // }
    } else {
      return;
    }
  }, [getPixel]);

  useEffect(() => {
    setColor(Math.floor(Math.random() * 26) + 1);
  }, []);

  // const submit = () => {
  //   try {
  //     const data = canvas2Hex(api.registry, canvasObj);
  //     setFields([
  //       {
  //         label: 'Pixels',
  //         content: pixels,
  //         value: data
  //       }
  //     ]);
  //     onOpen();
  //   } catch {
  //     setFields(null);
  //   }
  // };

  const onSubmit = () => {
    setIsloading(true);
    const result = [];
    for (let yAxis = 0; yAxis < HEIGHT_FIELD; yAxis++) {
      for (let xAxis = 0; xAxis < WIDTH_FIELD; xAxis++) {
        if (canvasObj[yAxis][xAxis] !== data[yAxis][xAxis]) {
          result.push([xAxis + 320 * yAxis, canvasObj[yAxis][xAxis]]);
        }
      }
    }
    excute([result], parseAmount(result.length.toString(), 10))
      .then(() => {
        forceUpdate();
      })
      .finally(() => {
        setIsloading(false);
      });
    // onClose();
    // setFields(null);
  };

  const onCancel = () => {
    onClose();
    setFields(null);
  };

  return (
    <Box justifyContent='center' display='flex' flexDirection='column' mx='auto'>
      <Box sx={{ position: 'relative', width: 'calc(100% - 122px)' }} display="flex" justifyContent="space-between">
        <Stack spacing="0px">
          <Box color='#0058FA' sx={{ display: 'inline-block' }}>
            Pool: <Fixed value={pool || '0'} decimals={10} postfix='DOT' />
          </Box>
          <Box>
            <Box color='gray.500' sx={{ display: 'inline-block' }}>
              Canvas size: 320 Pixel * 180 Pixel
            </Box>
          </Box>
          <Box display='inline-block'>
            <Box color='orange.400' sx={{ display: 'inline-block' }}>
              You have covered {pixels} pixels (1 Pixel cost 1 DOT)
            </Box>
          </Box>
        </Stack>
        <Box display='flex' alignItems='center'>
          <ToolBar
            paintMode={paintMode}
            onPenClick={onPenClick}
            onEraserClick={onEraserClick}
            onRevert={onRevert}
            onRefresh={onRefresh}
          />
          <Box ml={8}>
            <Button
              isDisabled={pixels === 0}
              isLoading={isLoading}
              colorScheme='primary'
              sx={{ ml: '10px', mr: '24px' }}
              onClick={onSubmit}
            >
              {saving ? <Spinner size='sm' color='white' /> : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Canvas data={data} signal={signal} paintMode={paintMode} color={color} getPixel={getPixel} />
      <Box
        as='aside'
        aria-label='palette'
        sx={{ position: 'absolute', height: 'calc(100% - 60px)', right: '0', top: '60px' }}
      >
        <Palette color={color} onColorChange={setColor} />
      </Box>
      {/* <SignMessageModal
        fields={fields || []}
        isOpen={isOpen}
        method={'mintWithMetadata'}
        title={'Confrim Pixel'}
        contract={contract}
        onSubmit={onSubmit}
        onCancel={onCancel}
      /> */}
    </Box>
  );
};
