import React, { useEffect } from 'react'
import Countdown from "react-countdown";
import { Box } from 'grommet';
import styled from 'styled-components';
import { utcToZonedTime } from 'date-fns-tz';
import { Howl } from 'howler';

import Intro from '../../components/Intro';

import Wait1 from '../../assets/wait1.mp3';
import Wait2 from '../../assets/wait2.mp3';

const CountdownBox = styled(Box)`
  font-size: 48px;
`;

function Wait({ game }) {
  useEffect(() => {
    let bgMusic1, bgMusic2;
    const startMusic1 = () => {
      bgMusic1.play();
    }
    const startMusic2 = () => {
      bgMusic2.play();
    }
    bgMusic1 = new Howl({
      src: [Wait1],
      autoplay: true,
      onend: startMusic2,
    });
    bgMusic2 = new Howl({
      src: [Wait2],
      onend: startMusic1,
    });

    return () => {
      bgMusic1.fade(1, 0, 1000);
      bgMusic1.once('fade', () => {
        bgMusic1.unload();
      });
      bgMusic2.fade(1, 0, 1000);
      bgMusic2.once('fade', () => {
        bgMusic2.unload();
      });
    }
  }, [])

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
