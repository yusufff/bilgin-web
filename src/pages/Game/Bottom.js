import React, { useRef, useState } from 'react'
import { Box, Text } from 'grommet';
import * as Icons from 'grommet-icons';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

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

function Bottom({
  gamerCount,
  showCountdown,
  durationSeconds,
  colors,
  onComplete,
  onTimer,
}) {
  return (
    <Box pad="medium" direction="row" align="center" justify="between">
      <Box direction="row" gap="small">
        <Text>{gamerCount?.viewer || 0}</Text>
        <Icons.View />
      </Box>
      {showCountdown &&
        <Box>
          <CountdownCircleTimer
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
        </Box>
      }
      <Box direction="row" gap="small">
        <Icons.Gamepad />
        <Text>{gamerCount?.gamer || 0}</Text>
      </Box>
    </Box>
  )
}

export default Bottom
