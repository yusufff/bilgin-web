import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom'
import { Box, Heading, Text, Button } from 'grommet';
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';
import Countdown from "react-countdown";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import Intro from '../../components/Intro';

import { useAuth } from '../../hooks/use-auth';
import { useSocket } from '../../hooks/use-socket';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
const Wrapper = styled(Box)`
  height: 100%;
  overflow: auto;
  animation: 450ms ${fadeIn} ${props => props.theme.global.easing};
`;
const marquee = keyframes`
  0% {
    transform: translateX(200%);
  }
  100% {
    transform: translateX(-200%);
  }
`

const IconBox = styled(Box)`
  position: relative;
`;
const ConnectionBox = styled(Box)`
  position: absolute;
  overflow: hidden;
  top: 100%; left: 0; right: 0;
  transform: translateY(-50%);
`;
const ConnectionText = styled(Text)`
  white-space: nowrap;
  transform-origin: 50% 50%;
  animation: 5s ${marquee} infinite linear;
`;

const ContentWrapper = styled(Box)`
  
`;
const pulse = keyframes`
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
`
const CountdownBox = styled(Box)`
  font-size: 48px;
  ${props => props.color ? `color: var(--${props.color});` : ''}

  span {
    animation: ${pulse} 2s infinite;
  }
`;

const AnswerButton = styled(Button)`
  margin: 10px 0;
`;

const StatsUser = styled(Box)`
  margin-bottom: ${props => props.marginBottom};
  transform: scale(${props => props.scale});
`;

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

function Game() {
  const { id } = useParams();
  const history = useHistory();
  const { user, setShowTabs } = useAuth();
  const [game, setGame] = useState();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await axios.get('https://yarismaapi.akbolat.net/game');
        if ( data.status ) {
          setGame(data.data.find((game) => +game.id === +id));
        }
      } catch ({ response }) {
        toast.error('Bir hata oluştu, lütfen tekrar dene.');
      }
    };
    fetchGames();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowTabs(false);

    return () => {
      setShowTabs(true);
    }
  }, [setShowTabs]);

  const [socket] = useSocket('https://yarismaapi.akbolat.net/', { //https://yarismaapi.akbolat.net/ http://localhost:8000
    gameId: id,
    username: user.username,
  });
  const [connected, setConnected] = useState();
  const [viewer, setViewer] = useState();
  const [gamerCount, setGamerCount] = useState(0);
  const [startBuffer, setStartBuffer] = useState();
  const [startGame, setStartGame] = useState(false);
  const [question, setQuestion] = useState();
  const [answerable, setAnswerable] = useState(false);
  const [answer, setAnswer] = useState();
  const [showAnswer, setShowAnswer] = useState();
  const [timer, setTimer] = useState(30);
  const [showStats, setShowStats] = useState();
  const [selfStats, setSelfStats] = useState();
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if ( socket ) {
      socket.on('connect', () => {
        setConnected(true);
        toast.success('Oyuna bağlandınız');
        console.log('connected', socket)
      });
      socket.on('disconnect', () => {
        setConnected(false);
        toast.error('Bağlantınız kesildi');
        console.log('disconnected', socket)
      });
      socket.emit('login', {
        gameID: id,
        username: user.username,
      })
      socket.on('gameData', (data) => {
        setGame(data);
        console.log('gameData', data)
        if ( !data.isStart ) {
          socket.emit('loginGame', {
            gameID: id,
            username: user.username,
          })
          console.log('oyun başlamadı, oyuncu olarak girildi');
        } else {
          setViewer(true);
          toast.success('Oyun başladı, izleyici olarak katıldın.');
          console.log('oyun başladı, izleyicisin');
        }
      })
      socket.on('count', (data) => {
        setGamerCount({
          viewer: data.viewerCount,
          gamer: data.gamerCount,
        });
        console.log('gamerCount', data)
      });
      socket.on('bufferStart', (data) => {
        setStartBuffer(true);
        console.log('bufferStart', data)
      });
      socket.on('gameStart', (data) => {
        setStartBuffer(false);
        setStartGame(true);
        console.log('gameStart', data)
      });
      socket.on('gameQuestion', (data) => {
        setShowStats();
        setSelfStats();
        setAnswerable(false);
        setAnswer();
        setTimer(30);
        setQuestion(game.questions.find((question) => +question.id === +data.id));
        console.log('gameQuestion', game.questions.find((question) => +question.id === +data.id))
      });
      socket.on('getStats', (data) => {
        const sortedStats = data.sort((a, b) => b.score - a.score);
        const s = sortedStats.findIndex((st) => st.username === user.username);
        setShowStats(sortedStats);
        setSelfStats({
          index: s,
          ...sortedStats[s],
        })
        console.log('getStats', data)
      });
      socket.on('lastStats', (data) => {
        const sortedStats = data.sort((a, b) => b.score - a.score);
        const s = sortedStats.findIndex((st) => st.username === user.username);
        setShowStats(sortedStats);
        setSelfStats({
          index: s,
          ...sortedStats[s],
        })
        setAnswerable(false);
        setAnswer();
        setTimer(30);
        setQuestion();
        setShowFinal(true);
        console.log('lastStats', data)
      });
    }

    return () => {
      socket && socket.removeAllListeners();
      socket && socket.close();
    };
  }, [socket, id, user])

  const goToHome = () => {
    history.push('/');
  }

  const selectAnswer = (option) => {
    if ( answer && viewer ) return;
    setAnswer(option);
    socket.emit('answer', {
      gameID: id,
      username: user.username,
      questionID: question.id,
      score: timer,
    })
  }

  return (
    <Wrapper flex background="neutral-5">
      <Box
        direction="row"
        align="center"
        justify="between"
        pad={{ vertical: '8px' }}
      >
        <Box
          flex={{ shrink: 0 }}
          pad="medium"
          onClick={goToHome}
        >
          <Icons.Previous color="light-1" />
        </Box>

        <Box>
          <Heading
            fill
            color="light-1"
            size="16px"
            textAlign="center"
            truncate
          >
            {game?.name}
          </Heading>
        </Box>

        <IconBox
          flex={{ shrink: 0 }}
          pad="medium"
        >
          {connected ? (
            <Icons.Wifi color="light-1" />
          ) : (
            <Icons.WifiNone color="light-1" />
          )}
          <ConnectionBox>
            <ConnectionText size="10px">{connected ? 'BAĞLI' : 'BAĞLANTI KESİLDİ'}</ConnectionText>
          </ConnectionBox>
        </IconBox>
      </Box>

      <ContentWrapper flex>
        {!startGame && !startBuffer && (
          <>
            <CountdownBox flex align="center" justify="center">
              {game && <Countdown date={game.date} />}
            </CountdownBox>
            <Intro wrapperHeight="none" flex />
          </>
        )}
        {!startGame && startBuffer && (
          <>
            <CountdownBox flex align="center" justify="center" color="status-ok">
              <Countdown date={Date.now() + (1000 * 60 * 5)} />
              <Heading textAlign="center">Yarışma Başlıyor!</Heading>
            </CountdownBox>
            <Intro wrapperHeight="none" flex />
          </>
        )}
        {startGame && question && (
          <>
            <Box flex align="center" justify="center">
              <Heading textAlign="center">{question.question}</Heading>
            </Box>
            <Box pad={{ vertical: '40px', horizontal: '40px' }}>
              <AnswerButton
                icon={showAnswer && question.answer.toLowerCase() === 'a' ? <Icons.Validate /> : null}
                size="large"
                primary={answer === 'a' || (showAnswer && question.answer.toLowerCase() === (answer || '').toLowerCase())}
                focusIndicator={false}
                onClick={() => selectAnswer('a')}
                disabled={!answerable || (answer && answer !== 'a')}
                label={question.a}
              />
              <AnswerButton
                icon={showAnswer && question.answer.toLowerCase() === 'b' ? <Icons.Validate /> : null}
                size="large"
                primary={answer === 'b' || (showAnswer && question.answer.toLowerCase() === (answer || '').toLowerCase())}
                focusIndicator={false}
                onClick={() => selectAnswer('b')}
                disabled={!answerable || (answer && answer !== 'b')}
                label={question.b}
              />
              <AnswerButton
                icon={showAnswer && question.answer.toLowerCase() === 'c' ? <Icons.Validate /> : null}
                size="large"
                primary={answer === 'c' || (showAnswer && question.answer.toLowerCase() === (answer || '').toLowerCase())}
                focusIndicator={false}
                onClick={() => selectAnswer('c')}
                disabled={!answerable || (answer && answer !== 'c')}
                label={question.c}
              />
            </Box>
            <Box pad="medium" direction="row" align="center" justify="between">
              <Box direction="row" gap="small">
                <Text>{gamerCount?.viewer || 0}</Text>
                <Icons.View />
              </Box>
              <Box>
                <CountdownCircleTimer
                  key={answerable ? 'a' : 'b'}
                  size={50}
                  strokeWidth={3}
                  isPlaying
                  durationSeconds={answerable ? 5 : 10}
                  colors={answerable ? [
                    ['#00C781', .33],
                    ['#FFAA15', .33],
                    ['#FF4040']
                  ] : [
                    ['#FFAA15']
                  ]}
                  trailColor="#17152D"
                  renderTime={(time) => {
                    setTimer(time);
                    return RenderTime(time);
                  }}
                  onComplete={() => {
                    if ( !answerable ) {
                      setAnswerable(true);
                    } else {
                      console.log(question.answer.toLowerCase(), answer);
                      setShowAnswer(true)
                      setAnswerable(false);
                    }
                  }}
                />
              </Box>
              <Box direction="row" gap="small">
                <Icons.Gamepad />
                <Text>{gamerCount?.gamer || 0}</Text>
              </Box>
            </Box>
          </>
        )}
        {startGame && showStats && (
          <>
            <Box align="center" justify="center">
              {showFinal && !viewer && <Heading level="2" textAlign="center" margin="small">Yarışma bitti! Tebrikler {selfStats.index + 1}. oldun</Heading>}
              <Heading level={showFinal ? '3' : '2'} textAlign="center">Puanlar</Heading>
            </Box>
            <Box flex pad={{ vertical: '40px', horizontal: '40px' }} gap="small" justify="start">
              {showStats.slice(0, 5).map((gamer, index) => (
                <StatsUser
                  key={index}
                  scale={
                    index === 0 ? '2' : 
                    index === 1 ? '1.3' :
                    index === 2 ? '1.1' :
                    '0.9'
                  }
                  marginBottom={
                    index === 0 ? '40px' : 
                    index === 1 ? '10px' :
                    index === 2 ? '10px' :
                    '-5px'
                  }
                  align="center"
                >
                  <Text size="large">{index + 1}. {gamer.username}</Text>
                  <Text
                    size="small"
                    color={
                      index === 0 ? 'status-ok' : 
                      index === 1 ? 'status-warning' :
                      index === 2 ? 'status-warning' :
                      'status-error'
                    }
                  >
                    {gamer.score}
                  </Text>
                </StatsUser>
              ))}
            </Box>
            {selfStats && !viewer && (
              <StatsUser
                direction="row"
                scale="1.3"
                align="center"
                justify="center"
                gap="medium"
                marginBottom="20px"
              >
                <Text weight="bold" size="large">{selfStats.index + 1}. {selfStats.username}</Text>
                <Text
                  size="small"
                  color="accent-2"
                  weight="bold"
                >
                  {selfStats.score}
                </Text>
              </StatsUser>
            )}
            {showFinal && (
              <Box pad="medium">
                <Button primary onClick={() => goToHome(true)} label="ÇIKIŞ" />
              </Box>
            )}
            <Box pad="medium" direction="row" align="center" justify="between">
              <Box direction="row" gap="small">
                <Text>{gamerCount?.viewer || 0}</Text>
                <Icons.View />
              </Box>
              <Box direction="row" gap="small">
                <Icons.Gamepad />
                <Text>{gamerCount?.gamer || 0}</Text>
              </Box>
            </Box>
          </>
        )}
        {!startGame && (
          <Box pad="medium" direction="row" align="center" justify="between">
            <Box direction="row" gap="small">
              <Icons.View />
              <Text>{gamerCount?.viewer || 0}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text>{gamerCount?.gamer || 0}</Text>
              <Icons.Gamepad />
            </Box>
          </Box>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

export default Game
