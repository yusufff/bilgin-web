import React, { useEffect } from 'react'
import Countdown from "react-countdown";
import Intro from '../../components/Intro';
import { Box, Heading, Text } from 'grommet';
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

function Buffer({ bufferTime }) {
  useEffect(() => {
    if ( window.bufferAudio ) {
      if ( bufferTime > 100000 ) {
        window.bufferAudio.play().catch(e => {
          console.log('Denied by browser', e);
        });
      } else {
        window.bufferAudio.pause();
        window.bufferAudio.currentTime = 0;
      }
    }
    return () => {
      if ( window.bufferAudio ) {
        window.bufferAudio.pause();
        window.bufferAudio.currentTime = 0;
      }
    }
  }, [bufferTime])

  return (
    <>
      <CountdownBox flex align="center" justify="center" color="status-ok">
        <Countdown key={bufferTime} date={Date.now() + bufferTime} />
        <Heading textAlign="center">Yarışma Başlıyor!</Heading>
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
      <Text textAlign="center" size="small">Yarışma başlamazsa sayfayı yenile</Text>
    </>
  )
}

export default React.memo(Buffer, (prevProps, nextProps) => prevProps.bufferTime === nextProps.bufferTime);
