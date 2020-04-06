import React, { useRef, useState } from 'react'
import { Box, Text } from 'grommet';
import * as Icons from 'grommet-icons';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styled from 'styled-components';

const RenderTime = time => {
  const currentTime = useRef(time);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  // eslint-disable-next-line no-unused-vars
  const [_, setOneLastRerender] = useState(0);

  if (currentTime.current !== time) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = time
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (time === 0) {
    setTimeout(() => {
      setOneLastRerender(val => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div
        key={time}
        className={`time ${isTimeUp ? 'up' : ''}`}
      >
        {time}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? 'down' : ''}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const IconWrapper = styled(Box)`
  height: 50px;
`;
const CountdownContainer = styled(Box)`
  position: relative;
`;
const QuestionCount = styled(Text)`
  position: absolute;
  display: block;
  bottom: 100%; left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
`;

function Bottom({
  questionText,
  countDownKey,
  gamerCount,
  showCountdown,
  durationSeconds,
  colors,
  onComplete,
  onTimer,
  viewer,
}) {
  return (
    <Box pad="medium" direction="row" align="center" justify="between">
      <IconWrapper direction="row" gap="small" align="center" justify="center">
        <Icons.View color={viewer ? 'status-ok' : null} />
        <Text color={viewer ? 'status-ok' : null}>{gamerCount?.viewer || 0}</Text>
      </IconWrapper>
      {showCountdown &&
        <CountdownContainer align="center">
          {questionText && <QuestionCount size="small" color="dark-3" margin={{ bottom: '5px' }}>{questionText}</QuestionCount>}
          <CountdownCircleTimer
            key={countDownKey}
            size={50}
            strokeWidth={3}
            isPlaying
            durationSeconds={durationSeconds}
            colors={colors}
            trailColor="#17152D"
            renderTime={(time) => {
              onTimer && onTimer(time);
              return RenderTime(time);
            }}
            onComplete={onComplete}
          />
        </CountdownContainer>
      }
      <IconWrapper direction="row" gap="small" align="center" justify="center">
        <Text color={!viewer ? 'status-ok' : null}>{gamerCount?.gamer || 0}</Text>
        <Icons.Gamepad color={!viewer ? 'status-ok' : null} />
      </IconWrapper>
    </Box>
  )
}

export default Bottom
