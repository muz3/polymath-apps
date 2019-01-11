import React from 'react';
import styled from 'styled-components';

import { InputError } from './InputError';
import { Label } from './Label';
import { Input } from './Input';
import { Context } from './Context';

interface Props {
  name: string;
  children?: React.ComponentType;
}

const Wrapper = styled.div`
  padding-bottom: 1.3rem;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const FormItem = ({ name, children, ...props }: Props) => {
  return (
    <Context.Provider value={{ name }}>
      <Wrapper {...props}>{children}</Wrapper>
    </Context.Provider>
  );
};
FormItem.Error = InputError;
FormItem.Label = Label;
FormItem.Input = Input;