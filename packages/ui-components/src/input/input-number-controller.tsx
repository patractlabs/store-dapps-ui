import { Input } from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

type InputNumberControllerProps = Omit<
  React.ComponentProps<typeof Controller> & React.ComponentProps<typeof Input>,
  'render'
> & {
  onChange?: (value: string) => void;
};

export const InputNumberController: React.FC<InputNumberControllerProps> = (props) => {
  const { name, render, as, defaultValue, control, rules, onFocus, onChange: onChangeValue, ...rest } = props;
  const inputProps = {
    pattern: '^[0-9]*[.]?[0-9]*$',
    inputMode: 'decimal' as 'decimal',
    ...rest
  };

  const pattern = new RegExp(inputProps.pattern);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        pattern,
        ...rules
      }}
      onFocus={onFocus}
      render={({ onChange, ref, ...field }) => (
        <Input
          onChange={(e) => {
            if (e.target.value === '' || pattern.test(e.target.value)) {
              onChange(e);
              onChangeValue && onChangeValue(e.target.value);
            }
          }}
          ref={ref}
          {...field}
          {...inputProps}
        />
      )}
    />
  );
};
