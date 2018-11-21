import React from 'react';
import styled from 'styled-components';

import SvgClose from '../../../../images/icons/Close';
import Box from '../../../Box';
import IconButton from '../../../IconButton';

const Container = styled(Box)`
  display: inline-flex;
  background-color: ${({ theme }) => theme.colors.blue[0]};
  border-radius: 50px;
  vertical-align: top;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[1]}px;
  margin-right: ${({ theme }) => theme.space[2]}px;
  margin-top: 7px;
`;

const LabelContainer = styled(Box)`
  display: flex;
  margin-left: -${({ theme }) => theme.space[1]}px;
  margin-right: ${({ theme }) => theme.space[3]}px;
`;

const StyledIconButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.gray[1]};
  color: ${({ theme }) => theme.colors.gray[0]};
  box-sizing: border-box;
  padding: 4px;
  height: 15px;
  width: 15px;
  border-radius: 10px;

  :hover {
    background-color: ${({ theme }) => theme.colors.gray[2]};
  }
`;

export default class Value extends React.Component {
  constructor(props) {
    super(props);

    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {
    this.props.onRemove(this.props.value);
  }

  render() {
    return (
      <Container>
        <LabelContainer>{this.props.label}</LabelContainer>
        <StyledIconButton Icon={SvgClose} onClick={this.onRemove} />
      </Container>
    );
  }
}
