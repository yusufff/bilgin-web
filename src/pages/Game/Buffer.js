import React, { useEffect } from 'react'
import Countdown from "react-countdown";
import Intro from '../../components/Intro';
import { Box, Heading } from 'grommet';
import styled, { keyframes } from 'styled-components';

import BufferSound from '../../assets/buffer.mp3';

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

const audio = new Audio(BufferSound);

function Buffer({ bufferTime }) {
  useEffect(() => {
    if ( bufferTime > 100000 ) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [bufferTime])

  return (
    <>
      <CountdownBox flex align="center" justify="center" color="status-ok">
        <Countdown date={Date.now() + bufferTime} />
        <Heading textAlign="center">Yarışma Başlıyor!</Heading>
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
    </>
  )
}

export default Buffer
