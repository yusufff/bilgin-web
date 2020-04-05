import React, { useState, useMemo } from 'react'
import { Box, Heading, Button } from 'grommet';
import * as Icons from 'grommet-icons';
import styled from 'styled-components';

import Bottom from './Bottom';

const AnswerButton = styled(Button)`
  margin: 10px 0;
`;

function Question({
  question,
  answer,
  setAnswer,
  gamerCount,
}) {
  const [answerable, setAnswerable] = useState(false);
  const [showAnswer, setShowAnswer] = useState();
  const [timer, setTimer] = useState(30);

  const options = useMemo(() => [
    {
      value: 'a',
      text: question.a,
    },
    {
      value: 'b',
      text: question.b,
    },
    {
      value: 'c',
      text: question.c,
    },
  ], [question])

  const selectAnswer = (value) => {
    if ( !answerable || showAnswer ) return;
    setAnswer(value, timer);
  }

  return (
    <>
      <Box flex align="center" justify="center">
        <Heading textAlign="center">{question.question}</Heading>
      </Box>
      <Box pad={{ vertical: '40px', horizontal: '40px' }}>
        {options.map((option) => {
          const primary = answer === option.value || (showAnswer && question.answer.toLowerCase() === (answer || '').toLowerCase())
          const icon = (showAnswer && question.answer.toLowerCase() === option.value) ? <Icons.Validate /> : null;
          const disabled = !showAnswer || !answerable || (answer && !showAnswer && answer !== option.value);
          
          return (
            <AnswerButton
              icon={icon}
              size="large"
              primary={primary}
              focusIndicator={false}
              onClick={() => selectAnswer(option.value)}
              disabled={disabled}
              label={question.a}
            />
          )
        })}
      </Box>
      <Bottom
        gamerCount={gamerCount}
        durationSeconds={answerable ? 5 : 10}
        colors={answerable ? [
          ['#00C781', .33],
          ['#FFAA15', .33],
          ['#FF4040']
        ] : [
          ['#FFAA15']
        ]}
        onComplete={() => {
          if ( !answerable ) {
            setAnswerable(true);
          } else {
            setShowAnswer(true)
            setAnswerable(false);
          }
        }}
        onTimer={(time) => {
          if (answerable) {
            setTimer(time)
          }
        }}
      />
    </>
  )
}

export default Question
