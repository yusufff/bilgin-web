import React from 'react'
import Intro from '../../components/Intro';
import { Box, Heading } from 'grommet';
import styled from 'styled-components';

const CountdownBox = styled(Box)`
  font-size: 48px;
`;

function WaitQuestion() {
  return (
    <>
      <CountdownBox flex align="center" justify="center">
        <Heading level="1">Yarışma Başladı!</Heading>
        <Heading level="2">Soru geliyor, hazır ol!</Heading>
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
    </>
  )
}

export default WaitQuestion
