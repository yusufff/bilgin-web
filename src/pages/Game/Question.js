import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Box, Heading, Button, Text } from 'grommet';
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';
import { Howl } from 'howler';

import Bottom from './Bottom';

import { useAuth } from '../../hooks/use-auth';

import CorrectSound from '../../assets/correct.mp3';
import WrongSound from '../../assets/wrong.mp3';

import DoubleJokerImage from '../../assets/double-answer.svg';
import EliminateJokerImage from '../../assets/eliminate.svg';

const AnswerButton = styled(Button)`
  margin: 10px 0;
`;

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`
const JokersWrapper = styled(Box)`
  animation: 450ms ${slideUp} ${props => props.theme.global.easing};
`;
const JokerButton = styled(Box)`
  opacity: ${props => props.disabled ? '.5' : '1'};
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
`;
const JokerLabel = styled(Text)`

`;
const JokerIcon = styled.img`
  width: 30px;
  height: 30px;
`;

function Question({
  game,
  question,
  gamerCount,
  jokers,
  onJoker,
}) {
  const hasSound = ((question.questionStart || question.questionStart === 0) && question.questionEnd);

  const { id } = useParams();
  const { user } = useAuth();
  const [answer, setAnswer] = useState();
  const [answerable, setAnswerable] = useState('bekle');
  const [timer, setTimer] = useState(hasSound ? 20 : 30);
  const [score, setScore] = useState(hasSound ? 20 : 30);
  const [sendAnswer, setSendAnswer] = useState(false);
  const [answerSent, setAnswerSent] = useState(false);

  const [doubleActive, setDoubleActive] = useState(false);
  const [selectedDoble, setSelectedDouble] = useState();
  const [eliminateActive, setEliminateActive] = useState(false);
  const [eliminated, setEliminated] = useState();

  const waitDuration = hasSound ? 
    Math.ceil(question.questionEnd - question.questionStart) + 3 :
    10;
  const answerDuration = hasSound ? 20 : 30;

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
        window.gameAudio.stop();
        window.gameAudio.play(`${question.id}-question`);
      } else if ( answerable === 'bitti' ) {
        const playAnswer = () => {
          window.gameAudio.stop();
          window.gameAudio.play(`${question.id}-answer`);
        }
        if (
          question.answer.toLowerCase() === (answer || '').toLowerCase() ||
          question.answer.toLowerCase() === (selectedDoble || '').toLowerCase()
        ) {
          new Howl({
            src: [CorrectSound],
            autoplay: true,
            onend: playAnswer,
            onloaderror: playAnswer,
            onplayerror: playAnswer,
          })
        } else {
          new Howl({
            src: [WrongSound],
            autoplay: true,
            onend: playAnswer,
            onloaderror: playAnswer,
            onplayerror: playAnswer,
          })
        }
      }
    }
  }, [question, answerable, answer, selectedDoble])

  useEffect(() => {
    if (
      !answerSent && sendAnswer && answer &&
      (
        question.answer.toLowerCase() === (answer || '').toLowerCase() ||
        question.answer.toLowerCase() === (selectedDoble || '').toLowerCase()
      )
    ) {
      setAnswerSent(true);
      window.socket.emit('answer', {
        gameID: id,
        username: user.username,
        questionID: question.id,
        score: score,
      })
    }
  }, [answerSent, answer, id, question, score, sendAnswer, user, selectedDoble]);

  useEffect(() => {
    if ( eliminateActive && question ) {
      const wrongOptions = ['a', 'b', 'c'].filter((o) => o !== question.answer.toLowerCase());
      const selectedOption = wrongOptions[Math.floor(Math.random()*wrongOptions.length)];
      setEliminated(selectedOption);
    }
  }, [question, eliminateActive])

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
    if ( answerable === 'cevapla' ) {
      if (
        (doubleActive && !answer && !selectedDoble) ||
        (!doubleActive && !answer)
      ) {
        setAnswer(value);
        setScore(timer);
      } else if ( doubleActive && answer && !selectedDoble ) {
        setSelectedDouble(value);
        setScore(timer);
      }
    }
  }

  const handleDobleJoker = () => {
    if ( !jokers?.double ) {
      onJoker('double');
      setDoubleActive(true);
    }
  }
  const handleEliminateJoker = () => {
    if ( !jokers?.eliminate ) {
      onJoker('eliminate');
      setEliminateActive(true);
    }
  }
  const renderJokers = () => {
    return (
      <JokersWrapper
        direction="row"
        gap="medium"
        align="stretch"
        justify="stretch"
        pad={{ horizontal: '40px' }}
      >
        <JokerButton
          flex
          direction="row"
          pad="5px"
          gap="medium"
          background={doubleActive ? 'accent-4' : 'light-3'}
          align="center"
          justify="center"
          round="small"
          onClick={handleDobleJoker}
          disabled={jokers?.double}
        >
          <JokerLabel size="small">Çift Cevap</JokerLabel>
          <JokerIcon src={DoubleJokerImage} />
        </JokerButton>
        <JokerButton
          flex
          direction="row"
          pad="5px"
          gap="medium"
          background={eliminateActive ? 'accent-4' : 'light-3'}
          align="center"
          justify="center"
          round="small"
          onClick={handleEliminateJoker}
          disabled={jokers?.eliminate}
        >
          <JokerLabel size="small">Cevap Ele</JokerLabel>
          <JokerIcon src={EliminateJokerImage} />
        </JokerButton>
      </JokersWrapper>
    )
  }

  return (
    <>
      <Box flex align="center" justify="center">
        <Heading level="3" textAlign="center">{question.question}</Heading>
      </Box>
      {answerable === 'cevapla' && renderJokers()}
      <Box pad={{ vertical: '40px', horizontal: '40px' }}>
        {options.map((option, index) => {
          const primary = (answer === option.value || selectedDoble === option.value) ||
            (answerable === 'bitti' && question.answer.toLowerCase() === option.value && (
              question.answer.toLowerCase() === (answer || '').toLowerCase() ||
              question.answer.toLowerCase() === (selectedDoble || '').toLowerCase()
            ));
          const icon = (answerable === 'bitti' && question.answer.toLowerCase() === option.value) ? <Icons.Validate /> : null;
          const disabled = answerable === 'bekle' || (
            answerable === 'cevapla' && (
              eliminateActive ?
                (eliminated === option.value) :
              doubleActive ? 
                (answer && selectedDoble && answer !== option.value && selectedDoble !== option.value) :
                (answer && answer !== option.value)
            )
          );
          
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
