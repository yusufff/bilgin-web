import React from 'react'
import Countdown from "react-countdown";
import Intro from '../../components/Intro';
import { Box } from 'grommet';
import styled from 'styled-components';

const CountdownBox = styled(Box)`
  font-size: 48px;
`;

function Wait({ game }) {
  return (
    <>
      <CountdownBox flex align="center" justify="center">
        {game && <Countdown date={game.date} />}
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
    </>
  )
}

export default Wait
