import React from 'react';
import {
  Flex,
  Box,
  Divider,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  PopoverContent
} from '@patract/ui-components';

export const Buyer: React.FC<{ buyers: string[] }> = ({ buyers }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Flex textDecoration='underline' color='rgba(0, 88, 250, 1)' _hover={{ cursor: 'pointer' }}>
          {buyers.length}
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Flex flexDirection='column'>
            {buyers &&
              buyers.map((buyer, i) => (
                <Box key={i}>
                  <Box>{buyer}</Box>
                  {i !== buyers.length - 1 ? <Divider /> : ''}
                </Box>
              ))}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
