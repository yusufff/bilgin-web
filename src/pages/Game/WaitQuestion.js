import React, { useEffect } from 'react'
import { Box, Heading, Text } from 'grommet';
import styled from 'styled-components';
import { Howl } from 'howler';

import Intro from '../../components/Intro';

import WaitQuestionLoop from '../../assets/wait-question-loop.mp3';

const CountdownBox = styled(Box)`
  font-size: 48px;
`;

function WaitQuestion() {
  useEffect(() => {
    const loop = new Howl({
      src: [WaitQuestionLoop],
      autoplay: true,
      loop: true,
    });

    return () => {
      loop.fade(1, 0, 500);
      loop.once('fade', () => {
        loop.unload();
      })
    }
  }, []);

  return (
    <>
      <CountdownBox flex align="center" justify="center">
        <Heading level="1">Yarışma Başladı!</Heading>
        <Heading level="2">Soru geliyor, hazır ol!</Heading>
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
      <Text textAlign="center" size="small">Yarışma başlamazsa sayfayı yenile</Text>
    </>
  )
}

export default WaitQuestion
