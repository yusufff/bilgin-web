import React from 'react'
import Countdown from "react-countdown";
import Intro from '../../components/Intro';
import { Box } from 'grommet';
import styled from 'styled-components';
import { utcToZonedTime } from 'date-fns-tz';

const CountdownBox = styled(Box)`
  font-size: 48px;
`;

function Wait({ game }) {
  let countdownDate = new Date();
  if (game) {
    const date = new Date(game.date);
    const timeZone = 'Etc/GMT';
    countdownDate = utcToZonedTime(date, timeZone);
  }
  return (
    <>
      <CountdownBox flex align="center" justify="center">
        {game && <Countdown date={countdownDate} />}
      </CountdownBox>
      <Intro wrapperHeight="none" flex />
    </>
  )
}

export default Wait
