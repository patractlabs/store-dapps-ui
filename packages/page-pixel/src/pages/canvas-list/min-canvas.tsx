import React from 'react';
import { Box } from '@chakra-ui/react';
import { paletteColors } from '../paint/palette';
import { Canvas } from '../paint/index';

const MiniCanvas: React.FC<{ canvasObj: Canvas }> = ({ canvasObj }) => {
  return (
    <Box sx={{ w: '100%' }}>
      <table>
        <tbody>
          {canvasObj.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((color, columnIndex) => (
                <td
                  id={`${rowIndex}-${columnIndex}`}
                  key={columnIndex}
                  data-xaxis={columnIndex}
                  data-yaxis={rowIndex}
                  style={{
                    width: '1px',
                    height: '1px',
                    background: paletteColors[color]
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

export default MiniCanvas;
