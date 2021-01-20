import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { paletteColors } from './palette';
import { canvasObj, paintHistory, PaintMode } from './index';

type CanvasProps = {
  paintMode: PaintMode;
  color: number;
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

const Canvas: React.FC<CanvasProps> = ({ paintMode, color }) => {
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
      isMouseDown = false;
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (isMouseDown) {
      snapshot();
      isMouseDown = false;
    }
  }, []);

  return (
    <Box sx={{ w: '100%', bgColor: 'rgba(171, 180, 208, 0.14)', borderRadius: '8px', p: '10px 72px 24px' }}>
      <table onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
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
                    width: '6px',
                    height: '6px',
                    border: '1px solid rgba(171, 180, 208, 0.30)'
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Canvas;
