//! Pretties hash
import React from 'react';
import { Box, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@patract/ui-components';

export const Hash: React.FC<{ hash: string; num: number[]; render: boolean }> = ({ hash, num, render }) => {
  if (hash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return <>?</>;
  } else {
    return (
      <Popover>
        <PopoverTrigger>
          <Box>{`${hash.slice(0, 4)}...${hash.slice(30, 32)}`}</Box>
        </PopoverTrigger>
        <PopoverContent borderColor='white.800'>
          <PopoverArrow />
          <PopoverBody>
            <Box textColor='red'>
              {render
                ? [...hash].map((char: any, i: any) => (
                    <span
                      key={i}
                      style={{
                        color: num && num.includes(Number(char)) && i > 1 ? 'green' : 'black'
                      }}
                    >
                      {char}
                    </span>
                  ))
                : hash}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
};
