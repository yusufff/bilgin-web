import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Box, Heading, Button } from 'grommet';
import * as Icons from 'grommet-icons';
import styled from 'styled-components';

import Bottom from './Bottom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

const AnswerButton = styled(Button)`
  margin: 10px 0;
`;

function Question({
  question,
  viewer,
  gamerCount,
}) {
  const { id } = useParams();
  const { user } = useAuth();
  const [answer, setAnswer] = useState();
  const [answerable, setAnswerable] = useState('bekle');
  const [showAnswer, setShowAnswer] = useState();
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(30);
  const [sendAnswer, setSendAnswer] = useState(false);
  const [answerSent, setAnswerSent] = useState(false);

  useEffect(() => {
    if ( !answerSent && sendAnswer && answer && !viewer && question.answer.toLowerCase() === (answer || '').toLowerCase()) {
      setAnswerSent(true);
      window.socket.emit('answer', {
        gameID: id,
        username: user.username,
        questionID: question.id,
        score: score,
      })
    }
  }, [answerSent, answer, id, question, score, sendAnswer, user, viewer]);

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
    if ( answerable !== 'cevapla' || showAnswer || answer || viewer ) return;
    setAnswer(value);
    setScore(timer);
  }

  return (
    <>
      <Box flex align="center" justify="center">
        <Heading textAlign="center">{question.question}</Heading>
      </Box>
      <Box pad={{ vertical: '40px', horizontal: '40px' }}>
        {options.map((option, index) => {
          const primary = answer === option.value || (showAnswer && question.answer.toLowerCase() === option.value && question.answer.toLowerCase() === (answer || '').toLowerCase())
          const icon = (showAnswer && question.answer.toLowerCase() === option.value) ? <Icons.Validate /> : null;
          const disabled = answerable === 'bekle' || (answer && !showAnswer && answer !== option.value);
          
          return (
            <AnswerButton
              key={index}
              icon={icon}
              size="large"
              primary={primary}
              focusIndicator={false}
              onClick={() => selectAnswer(option.value)}
              disabled={disabled}
              label={question[option.value]}
            />
          )
        })}
      </Box>
      <Bottom
        showCountdown={answerable !== 'bitti'}
        countDownKey={answerable === 'cevapla' ? 'a' : 'b'}
        gamerCount={gamerCount}
        durationSeconds={answerable === 'cevapla' ? 30 : 10}
        colors={answerable === 'cevapla' ? [
          ['#00C781', .33],
          ['#FFAA15', .33],
          ['#FF4040']
        ] : [
          ['#FFAA15']
        ]}
        onComplete={() => {
          if ( answerable === 'bekle' ) {
            setAnswerable('cevapla');
          } else {
            setSendAnswer(true);
            setShowAnswer(true);
            setAnswerable('bitti');
          }
        }}
        onTimer={(time) => {
          if ( answerable === 'cevapla' ) {
            setTimer(time)
          }
        }}
      />
    </>
  )
}

export default Question
