import React from 'react';
import styled from 'styled-components';
import { IconCircled, icons } from '@polymathnetwork/new-ui';

const ListIconBase = ({ active, ...otherProps }: { active?: boolean }) => (
  <IconCircled
    Asset={icons.SvgCaretDown2}
    bg="gray.2"
    color="white"
    width={24}
    height={24}
    scale={0.75}
    {...otherProps}
  />
);

export const ListIcon = styled(ListIconBase)`
  transform: rotateZ(0.75turn);
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;
