//! Pretties hash
import React from 'react';
import {
  Address,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody
} from '@patract/ui-components';

const renderHash: React.FC<{ hash: string }> = ({ hash }) => {
  let count = 0;
  return (
    <Box>
      {[...hash].map((char: any, i: any) => {
        if (Number.parseInt(char) > -1) {
          count += 1;
        }
        return (
          <span
            key={i}
            style={{
              color: Number.parseInt(char) > -1 && i > 1 && count < 5 ? '#FF7600' : 'black'
            }}
          >
            {`${char}`}
          </span>
        );
      })}
    </Box>
  );
};

export const Hash: React.FC<{ hash: string; num: number[]; render: boolean; limit?: number }> = ({
  hash,
  render,
  limit = 12
}) => {
  if (hash.length === 48) {
    return <Address value={hash} type='address' hideText />;
  } else if (hash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return <>?</>;
  } else if (limit === 66) {
    return <Box>{renderHash({ hash })}</Box>;
  } else {
    return (
      <Popover>
        <PopoverTrigger>
          <Box>{render ? renderHash({ hash: `${hash.slice(0, limit)}...` }) : `${hash.slice(0, limit)}...`}</Box>
        </PopoverTrigger>
        <PopoverContent borderColor='white.800'>
          <PopoverArrow />
          <PopoverBody>
            <Box textColor='red'>{render ? renderHash({ hash }) : hash}</Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
};
