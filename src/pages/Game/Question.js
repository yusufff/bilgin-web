import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Box, Heading, Button } from 'grommet';
import * as Icons from 'grommet-icons';
import styled from 'styled-components';
import { Howl } from 'howler';

import Bottom from './Bottom';

import { useAuth } from '../../hooks/use-auth';

const AnswerButton = styled(Button)`
  margin: 10px 0;
`;

function Question({
  game,
  question,
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

  const waitDuration = (question.questionStart && question.questionEnd) ? 
    Math.ceil(question.questionEnd - question.questionStart) + 5 :
    10;
  const answerDuration = (question.questionStart && question.questionEnd) ? 20 : 30;

  useEffect(() => {
    if ( !window.gameAudio ) {
      window.gameAudio = new Howl({
        src: [game.questionSound],
        sprite: game.questions.reduce((s, question) => {
          const questionStart = question.questionStart * 1000;
          const questionEnd = (question.questionEnd - question.questionStart) * 1000;
          const answerStart = question.answerStart * 1000;
          const answerEnd = (question.answerEnd - question.answerStart) * 1000;
          s[`${question.id}-question`] = [questionStart, questionEnd];
          s[`${question.id}-answer`] = [answerStart, answerEnd];
          return s;
        }, {})
      });
    }
  }, [game])

  useEffect(() => {
    if ( window.gameAudio ) {
      if ( answerable === 'bekle' ) {
        window.gameAudio.play(`${question.id}-question`);
      } else if ( answerable === 'bitti' ) {
        window.gameAudio.play(`${question.id}-answer`);
      }
    }
    return () => {
      window.gameAudio && window.gameAudio.stop();
    }
  }, [question, answerable])

  useEffect(() => {
    if ( !answerSent && sendAnswer && answer && question.answer.toLowerCase() === (answer || '').toLowerCase()) {
      setAnswerSent(true);
      window.socket.emit('answer', {
        gameID: id,
        username: user.username,
        questionID: question.id,
        score: score,
      })
    }
  }, [answerSent, answer, id, question, score, sendAnswer, user]);

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
    if ( answerable !== 'cevapla' || showAnswer || answer ) return;
    setAnswer(value);
    setScore(timer);
  }

  return (
    <>
      <Box flex align="center" justify="center">
        <Heading level="2" textAlign="center">{question.question}</Heading>
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
              size="medium"
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
        questionText={`${question.id}/${game?.questions?.length ?? '0'}`}
        showCountdown={answerable !== 'bitti'}
        countDownKey={answerable === 'cevapla' ? 'a' : 'b'}
        gamerCount={gamerCount}
        durationSeconds={answerable === 'cevapla' ? answerDuration : waitDuration}
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
