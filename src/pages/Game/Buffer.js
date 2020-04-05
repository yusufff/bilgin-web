import React from 'react'
import Countdown from "react-countdown";
import Intro from '../../components/Intro';
import { Box, Heading } from 'grommet';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
`
const CountdownBox = styled(Box)`
  font-size: 48px;
  ${props => props.color ? `color: var(--${props.color});` : ''}

  span {
    animation: ${pulse} 2s infinite;
  }
`;

function Buffer() {
  return (
    <>
      <CountdownBox flex align="center" justify="center" color="status-ok">
        <Countdown date={Date.now() + (1000 * 60 * 5)} />
        <Heading textAlign="center">Yarışma Başlıyor!</Heading>
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
    </>
  )
}

export default Buffer
