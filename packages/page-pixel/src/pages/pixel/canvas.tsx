import React, { useState, useCallback } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';

const canvasArray = new Array(90 * 160).fill(null);

const Canvas: React.FC = () => {
  const [mouseDown, setMouseDown] = useState(false);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setMouseDown(true);
    const { xaxis, yaxis } = (event.target as HTMLDivElement)['dataset'];
    console.log('onMouseDown', xaxis, yaxis);
  }, []);

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseDown) return;
    const { xaxis, yaxis } = (event.target as HTMLDivElement)['dataset'];
    console.log('onMouseMove', xaxis, yaxis);
  }, []);

  const onMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  console.log('render');

  return (
    <Box sx={{ w: '100%', bgColor: 'rgba(171, 180, 208, 0.14)', borderRadius: '8px', p: '10px 72px 24px' }}>
      <Grid
        templateRows='repeat(90, 1fr)'
        templateColumns='repeat(160, 1fr)'
        bgColor='#FFFFFF'
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {canvasArray.map((_, index) => (
          <div
            key={index}
            style={{ width: '6px', height: '6px', border: '1px solid rgba(171, 180, 208, 0.30)' }}
            data-xaxis={index % 160}
            data-yaxis={Math.floor(index / 160)}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default Canvas;
