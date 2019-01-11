import * as React from 'react';
import styled from 'styled-components';
import {
  minWidth,
  MinWidthProps,
  maxWidth,
  MaxWidthProps,
  height,
  HeightProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system';

export type BoxProps = MinWidthProps &
  MaxWidthProps &
  HeightProps &
  SpaceProps &
  TextAlignProps;

export const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  ${minWidth};
  ${maxWidth};
  ${height};
  ${textAlign};
  ${space};
`;

// // TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const BoxDocz = (props: BoxProps) => {
  return <Box {...props} />;
};