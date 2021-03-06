import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom'
import { Box, Heading, Text, Button } from 'grommet';
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';
import io from 'socket.io-client';
import { Howl } from 'howler';

import { useAuth } from '../../hooks/use-auth';

import { JOKERS_BASE, getLocalJokers, setLocalJokers } from '../../utils/jokers';

import Wait from './Wait';
import Buffer from './Buffer';
import WaitQuestion from './WaitQuestion';
import Question from './Question';
import Stats from './Stats';
import Bottom from './Bottom';

import { FSEvent } from '../../utils/fs';

import { webm } from '../../assets/media';

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
  overflow: hidden;
`;

function Game() {
  const { id } = useParams();
  const history = useHistory();
  const { user, setShowTabs, seenHome, setSeenHome } = useAuth();
  const [game, setGame] = useState();
  const noSleep = useRef();

  useEffect(() => {
    return () => {
      if ( noSleep.current )
        noSleep.current.unload();
    }
  }, [])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await axios.get('https://lolitoys.net/game');
        if ( data.status && data.data ) {
          setGame(data.data.id ? data.data : data.data.find((game) => +game.id === +id));
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

  if (!window.socket) {
    window.socket = io('https://lolitoys.net/', {
      autoConnect: false,
    });
  }
  const [connected, setConnected] = useState();
  const [gamerCount, setGamerCount] = useState(0);
  const [startBuffer, setStartBuffer] = useState();
  const [bufferTime, setBufferTime] = useState(300000);
  const [startGame, setStartGame] = useState();
  const [activeQuestion, setActiveQuestion] = useState();
  const [question, setQuestion] = useState();
  const [showStats, setShowStats] = useState();
  const [selfStats, setSelfStats] = useState();
  const [showFinal, setShowFinal] = useState();
  const [jokers, setJokers] = useState({ ...JOKERS_BASE });

  const gameId = game?.id;
  useEffect(() => {
    if ( gameId ) {
      setJokers(getLocalJokers(gameId));
    }
  }, [gameId])

  useEffect(() => {
    if ( game?.questions && activeQuestion ) {
      setQuestion(game.questions.find((question) => +question.id === +activeQuestion));
    }
  }, [game, activeQuestion])

  useEffect(() => {
    if ( window.socket && user?.username ) {
      window.socket.connect();
      window.socket.on('connect', () => {
        setConnected(true);
        toast.success('Oyuna bağlandınız');
        FSEvent('⚡️ Connected', {
          game: id
        });
      });
      window.socket.on('disconnect', () => {
        setConnected(false);
        toast.error('Bağlantınız kesildi');
        FSEvent('🚫 Disconnected', {
          game: id
        });
      });
      window.socket.emit('login', {
        gameID: id,
        username: user.username,
      })
      window.socket.on('gameData', (data) => {
        setStartBuffer(data.isBuffer);
        setBufferTime(data.bufferTime);
        setStartGame(data.isStart);
        FSEvent('ℹ️ Game Data', {
          game: id,
          data: JSON.stringify(data),
        });
      })
      window.socket.on('count', (data) => {
        setGamerCount({
          viewer: data.viewerCount,
          gamer: data.gamerCount,
        });
      });
      window.socket.on('bufferStart', (data) => {
        setStartBuffer(true);
        FSEvent('⏳ Buffer Start', {
          game: id,
        });
      });
      window.socket.on('gameStart', (data) => {
        setStartBuffer(false);
        setStartGame(true);
        FSEvent('🎮 Game Start', {
          game: id,
        });
      });
      window.socket.on('gameQuestion', (data) => {
        setShowStats();
        setSelfStats();
        setActiveQuestion(data.id);
        FSEvent('❓ New Question', {
          game: id,
          data: JSON.stringify(data),
        });
      });
      window.socket.on('getStats', (data) => {
        const sortedStats = data.sort((a, b) => b.score - a.score);
        const s = sortedStats.findIndex((st) => st.username === user.username);
        setShowStats(sortedStats);
        setSelfStats({
          index: s,
          ...sortedStats[s],
        })
        FSEvent('🏆 Stats', {
          game: id,
          rank_int: s + 1,
          stats: JSON.stringify(sortedStats),
        });
      });
      window.socket.on('lastStats', (data) => {
        const sortedStats = data.sort((a, b) => b.score - a.score);
        const s = sortedStats.findIndex((st) => st.username === user.username);
        setShowStats(sortedStats);
        setSelfStats({
          index: s,
          ...sortedStats[s],
        })
        setQuestion();
        setShowFinal(true);
        FSEvent('🎉 Final', {
          game: id,
          rank_int: s + 1,
          stats: JSON.stringify(sortedStats),
        });
      });
    }

    return () => {
      if ( window.socket ) {
        window.socket.removeAllListeners();
        window.socket.close();
        window.socket.off();
        window.socket.disconnect();
        FSEvent('🚫 Closed Connection', {
          game: id
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.username])

  const handleJoinGame = () => {
    setSeenHome(true);

    if ( !noSleep.current ) {
      noSleep.current = new Howl({
        src: [webm],
        autoplay: true,
        mute: true,
        loop: true,
        volume: 0,
      });
    }

    if ( !window.gameAudio && game?.questionSound ) {
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
  }

  const goToHome = () => {
    history.push('/');
  }

  const handleJoker = (joker_key) => {
    setJokers(prevState => ({
      ...prevState,
      [joker_key]: true,
    }));
    setLocalJokers(game.id, joker_key, true);
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
        {!seenHome ? (
          <Box flex align="center" justify="center">
            <Button
              primary
              size="large"
              label={'YARIŞMAYA KATIL'}
              onClick={handleJoinGame}
            />
          </Box>
        ) : !startGame && !startBuffer ? (
          <Wait game={game} />
        ) : !startGame && startBuffer ? (
          <Buffer bufferTime={bufferTime} />
        ) : startGame && !question && !showStats ? (
          <WaitQuestion />
        ) : startGame && showStats ? (
          <Stats
            showFinal={showFinal}
            showStats={showStats}
            selfStats={selfStats}
            gamerCount={gamerCount}
          />
        ) : startGame && question ? (
          <Question
            key={question.id}
            game={game}
            question={question}
            gamerCount={gamerCount}
            jokers={jokers}
            onJoker={handleJoker}
          />
        ) : null}
        {(!startGame || ( startGame && !question && !showStats )) && (
          <Bottom
            gamerCount={gamerCount}
            showCountdown={false}
          />
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

export default Game
