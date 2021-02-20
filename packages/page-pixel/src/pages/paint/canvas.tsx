import { useApi } from '@patract/react-hooks';
import { Center } from '@patract/ui-components';
import React, { useCallback, useEffect, useReducer } from 'react';
import { hex2Canvas } from '../../utils';
import { canvasObj, paintCanvas, paintHistory, PaintMode } from './paint';
import { paletteColors } from './palette';
import { usePixelDetail } from '../../hooks/use-pixel-detail';

type CanvasProps = {
  data: any;
  paintMode: PaintMode;
  color: number;
  signal: number;
  getPixel: () => void;
};

let isMouseDown = false;

const paint = (xAxis: number, yAxis: number, color: number, paintMode: PaintMode) => {
  const cellNode = document.getElementById(`${yAxis}-${xAxis}`);
  if (cellNode) {
    const drawColor = paintMode === 'pen' ? color : 0;
    cellNode.style.backgroundColor = paletteColors[drawColor];
    canvasObj[yAxis][xAxis] = drawColor;
  }
};

const snapshot = () => {
  paintHistory.push(JSON.stringify(canvasObj));
};

const Canvas: React.FC<CanvasProps> = ({ data, paintMode, color, getPixel }) => {

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      isMouseDown = true;
      const { xaxis, yaxis } = (event.target as HTMLDivElement)['dataset'];
      paint(Number(xaxis), Number(yaxis), color, paintMode);
    },
    [color, paintMode]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isMouseDown) return;
      const { xaxis, yaxis } = (event.target as HTMLDivElement)['dataset'];
      paint(Number(xaxis), Number(yaxis), color, paintMode);
    },
    [color, paintMode]
  );

  const onMouseUp = useCallback(() => {
    if (isMouseDown) {
      snapshot();
      getPixel();
      isMouseDown = false;
    }
  }, [getPixel]);

  const onMouseLeave = useCallback(() => {
    if (isMouseDown) {
      snapshot();
      getPixel();
    }
  }, [getPixel]);

  useEffect(() => {
    if (data) {
      paintCanvas(JSON.parse(JSON.stringify(data)));
      paintHistory.length = 0;
      paintHistory.push(JSON.stringify(canvasObj));
    }
    getPixel();
  }, [getPixel, data]);

  return (
    <Center sx={{ w: '100%', borderRadius: '8px', p: '10px 0 24px', width: 'calc(100% - 122px)' }}>
      <table
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ background: '#FFFFFF', width: '100%' }}
      >
        <tbody>
          {canvasObj.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((_, columnIndex) => (
                <td
                  id={`${rowIndex}-${columnIndex}`}
                  key={columnIndex}
                  data-xaxis={columnIndex}
                  data-yaxis={rowIndex}
                  style={{
                    width: '0.3125%',
                    height: '0',
                    paddingBottom: 'calc(0.3125% - 2px)',
                    border: '1px solid rgba(171, 180, 208, 0.30)'
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Center>
  );
};

export default Canvas;
