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
  Portal,
  useDisclosure,
  Flex
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
  onChangeValue?: (value: string) => void;
  onChangeOption?: (value: any) => void;
  inputName: string;
  selectName: string;
  usePortal?: boolean;
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
        fontSize: 'lg',
        lineHeight: 'short',
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
        <Heading as='h4' sx={{ fontSize: 'md', fontWeight: 'medium', lineHeight: 'short', mb: '2' }}>
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
      <Box sx={{ py: '4' }}>
        <Heading
          as='h4'
          color='black'
          sx={{ fontSize: 'md', fontWeight: 'medium', lineHeight: 'short', mb: '2', ml: '18px' }}
        >
          Token name
        </Heading>
        <ul>
          {options
            .filter(
              ({ label, fullName }) =>
                label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 || fullName.indexOf(inputValue) >= 0
            )
            .map((option) => (
              <Box
                as='li'
                key={option.fullName}
                sx={{ listStyle: 'none', py: '3px', cursor: 'pointer' }}
                onClick={onSelect.bind(null, option)}
              >
                <Flex sx={{ px: '18px' }} alignItems='center'>
                  {/* <Image
                    src={option.icon}
                    sx={{
                      display: 'inline-block',
                      w: '44px',
                      h: '44px',
                      bgColor: '#FFFFFF',
                      mr: '12px'
                    }}
                  /> */}
                  <Text
                    color='gray.600'
                    sx={{
                      display: 'inline-block',
                      w: '50px',
                      fontSize: 'lg'
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    sx={{
                      display: 'inline-block',
                      color: 'brand.grey',
                      w: '74px',
                      fontSize: 'lg',
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
                      fontSize: 'xs',
                      lineHeight: '17px'
                    }}
                  >
                    ({option.address})
                  </Text>
                  <Text
                    sx={{
                      display: 'inline-block',
                      w: '138px',
                      fontSize: 'md',
                      lineHeight: '22px',
                      textAlign: 'right'
                    }}
                  >
                    {option.balance}
                  </Text>
                </Flex>
              </Box>
            ))}
        </ul>
      </Box>
    </React.Fragment>
  );
};

const InputSelect: React.FC<InputSelectProps> = (props) => {
  const {
    frontLabel,
    backLabel,
    options,
    inputName,
    selectName,
    control,
    watch,
    defaultValue,
    defaultOption,
    usePortal = false,
    onChangeValue,
    onChangeOption
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selected = watch([selectName])[selectName];

  const MenuSelect = (
    <Box
      border='1px solid'
      borderColor='gray.200'
      width='160px'
      sx={{
        display: 'inline-block',
        verticalAlign: 'top',
        borderRadius: '0 4px 4px 0',
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

  const content = (
    <PopoverContent sx={{ w: '464px', left: '-226px', top: '-6px', zIndex: 'dropdown' }}>
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
              onChangeOption && onChangeOption(option);
            }}
          />
        )}
      />
    </PopoverContent>
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
        onChange={onChangeValue}
        defaultValue={defaultValue}
        sx={{
          w: 'calc(100% - 160px)',
          h: '44px',
          borderRadius: '4px 0 0 4px',
          borderRight: '0',
          _focus: { boxShadow: 'none' }
        }}
      />
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverTrigger>{MenuSelect}</PopoverTrigger>
        {usePortal ? <Portal>{content}</Portal> : content}
      </Popover>
    </React.Fragment>
  );
};

export default InputSelect;
