import React, { useState } from 'react';
import {
  Box,
  Heading,
  Image,
  Input,
  Text,
  Divider,
  Center,
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { Controller } from 'react-hook-form';
import { InputNumberController } from '@patract/ui-components';

export type MenuOption = {
  value: string;
  label: string;
  fullName: string;
  icon: string;
  address: string;
  balance: number;
};

export type InputSelectProps = {
  frontLabel: string;
  backLabel?: string;
  options: Array<MenuOption>;
  control: any;
  inputName: string;
  selectName: string;
} & Omit<React.ComponentProps<typeof Controller>, 'render'>;

const ValueContainer = ({ selectOption }: { selectOption: MenuOption }) => (
  <React.Fragment>
    <Image
      src={selectOption.icon}
      sx={{
        display: 'inline-block',
        w: '42px',
        h: '42px',
        bgColor: '#FFFFFF'
      }}
    />
    <Text
      sx={{
        display: 'inline-block',
        verticalAlign: 'top',
        fontSize: '18px',
        lineHeight: '25px',
        background: '#E1E9FF',
        borderRadius: '4px',
        minWidth: '74px',
        padding: '5px 0',
        textAlign: 'center',
        left: '42px'
      }}
    >
      {selectOption.label}
    </Text>
  </React.Fragment>
);

const Menu = ({ options, onSelect }: { options: Array<MenuOption>; onSelect: (menuOption: MenuOption) => void }) => {
  const [inputValue, setInputValue] = useState('');
  return (
    <React.Fragment>
      <Box sx={{ p: '16px 18px' }}>
        <Heading as='h4' sx={{ fontSize: '16px', fontWeight: '500', lineHeight: '22px', mb: '8px' }}>
          Select a token
        </Heading>
        <Input
          placeholder='Search address name or symbol'
          onChange={(event) => setInputValue(event.target.value)}
          value={inputValue}
          sx={{
            height: '45px',
            background: '#F1F3F6',
            borderRadius: '23px',
            border: '0',
            _focus: { borderColor: 'transparent' }
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ py: '16px' }}>
        <Heading as='h4' sx={{ fontSize: '16px', fontWeight: '500', lineHeight: '22px', mb: '8px', ml: '18px' }}>
          Token name
        </Heading>
        <ul>
          {options
            .filter(
              ({ label, fullName }) => label.toLowerCase().indexOf(inputValue) >= 0 || fullName.indexOf(inputValue) >= 0
            )
            .map((option) => (
              <Box
                as='li'
                key={option.fullName}
                sx={{ listStyle: 'none', py: '3px', cursor: 'pointer', _hover: { bgColor: '#E4EDFF' } }}
                onClick={onSelect.bind(null, option)}
              >
                <Center sx={{ px: '18px' }}>
                  <Image
                    src={option.icon}
                    sx={{
                      display: 'inline-block',
                      w: '44px',
                      h: '44px',
                      bgColor: '#FFFFFF',
                      mr: '12px'
                    }}
                  />
                  <Text
                    sx={{
                      display: 'inline-block',
                      w: '50px',
                      color: 'brand.primary',
                      fontSize: '18px',
                      lineHeight: '25px'
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    sx={{
                      display: 'inline-block',
                      color: 'brand.grey',
                      w: '74px',
                      fontSize: '12px',
                      lineHeight: '17px'
                    }}
                  >
                    {option.fullName}
                  </Text>
                  <Text
                    sx={{
                      display: 'inline-block',
                      color: 'brand.grey',
                      w: '101px',
                      fontSize: '12px',
                      lineHeight: '17px'
                    }}
                  >
                    ({option.address})
                  </Text>
                  <Text
                    sx={{
                      display: 'inline-block',
                      w: '138px',
                      fontSize: '16px',
                      lineHeight: '22px',
                      textAlign: 'right'
                    }}
                  >
                    {option.balance}
                  </Text>
                </Center>
              </Box>
            ))}
        </ul>
      </Box>
    </React.Fragment>
  );
};

const InputSelect: React.FC<InputSelectProps> = (props) => {
  const { frontLabel, backLabel, options, inputName, selectName, control, watch, defaultValue, defaultOption } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selected = watch([selectName])[selectName];

  const MenuSelect = (
    <Box
      sx={{
        display: 'inline-block',
        verticalAlign: 'top',
        width: '155px',
        border: '1px solid',
        borderRadius: '0 4px 4px 0',
        borderColor: '#0058FA',
        borderLeft: '0',
        cursor: 'pointer',
        bgColor: '#FFFFFF'
      }}
    >
      <Center>
        <ValueContainer selectOption={selected} />
        <TriangleDownIcon sx={{ verticalAlign: 'top', w: '10px', h: '10px', color: '#0058FA', ml: '8px' }} />
      </Center>
    </Box>
  );

  return (
    <React.Fragment>
      <FormLabel textStyle='form-label'>
        <span>{frontLabel}</span>
        <span>{backLabel}</span>
      </FormLabel>
      <InputNumberController
        name={inputName}
        control={control}
        defaultValue={defaultValue}
        focusBorderColor='#0058FA'
        sx={{
          w: '309px',
          h: '44px',
          fontSize: '18px',
          bgColor: '#FFFFFF',
          borderRadius: '4px 0 0 4px',
          border: '1px solid',
          borderColor: '#0058FA',
          borderRight: '0',
          verticalAlign: 'top',
          _hover: { borderColor: '#0058FA' },
          _focus: { boxShadow: 'none' }
        }}
      />
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverTrigger>{MenuSelect}</PopoverTrigger>
        <PopoverContent sx={{ w: '464px', left: '-226px', top: '-6px' }}>
          <Controller
            name={selectName}
            control={control}
            defaultValue={defaultOption || options[0] || {}}
            render={({ onChange }) => (
              <Menu
                options={options}
                onSelect={(option) => {
                  onClose();
                  onChange(option);
                }}
              />
            )}
          />
        </PopoverContent>
      </Popover>
    </React.Fragment>
  );
};

export default InputSelect;
