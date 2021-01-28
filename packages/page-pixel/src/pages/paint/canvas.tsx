import { useApi } from '@patract/react-hooks';
import { Center } from '@patract/ui-components';
import React, { useCallback, useEffect } from 'react';
import { hex2Canvas } from '../../utils';
import { canvasObj, paintCanvas, paintHistory, PaintMode } from './paint';
import { paletteColors } from './palette';

type CanvasProps = {
  paintMode: PaintMode;
  color: number;
  getPixel: () => void;
  editingId?: number;
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

const Canvas: React.FC<CanvasProps> = ({ paintMode, color, getPixel, editingId }) => {
  const { api } = useApi();

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
    if (typeof editingId === 'number') {
      const canvasListBuffer = localStorage.getItem('canvas-list') || '[]';
      const canvasListArray = JSON.parse(canvasListBuffer);
      const canvasHex = canvasListArray[Number(editingId)];
      if (canvasHex) {
        paintCanvas(hex2Canvas(api.registry, canvasHex));
      }
      getPixel();
    }
  }, [getPixel]);

  return (
    <Center sx={{ w: '100%', borderRadius: '8px', p: '10px 0 24px' }}>
      <table
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ background: '#FFFFFF' }}
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
                    width: '7px',
                    height: '7px',
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
