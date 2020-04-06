import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom'
import { Box, Heading, Text } from 'grommet';
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';
import io from 'socket.io-client';

import { useAuth } from '../../hooks/use-auth';

import Wait from './Wait';
import Buffer from './Buffer';
import WaitQuestion from './WaitQuestion';
import Question from './Question';
import Stats from './Stats';
import Bottom from './Bottom';

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
  const { user, setShowTabs } = useAuth();
  const [game, setGame] = useState();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await axios.get('https://yarismaapi.akbolat.net/game');
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
    window.socket = io('https://yarismaapi.akbolat.net/', {
      autoConnect: false,
    });
  }
  const [connected, setConnected] = useState();
  const [viewer, setViewer] = useState();
  const [gamerCount, setGamerCount] = useState(0);
  const [startBuffer, setStartBuffer] = useState();
  const [bufferTime, setBufferTime] = useState(300000);
  const [startGame, setStartGame] = useState();
  const [activeQuestion, setActiveQuestion] = useState();
  const [question, setQuestion] = useState();
  const [showStats, setShowStats] = useState();
  const [selfStats, setSelfStats] = useState();
  const [showFinal, setShowFinal] = useState();

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
      });
      window.socket.on('disconnect', () => {
        setConnected(false);
        toast.error('Bağlantınız kesildi');
      });
      window.socket.emit('login', {
        gameID: id,
        username: user.username,
      })
      window.socket.on('gameData', (data) => {
        setGame(data);
        setStartBuffer(data.isBuffer);
        setBufferTime(data.bufferTime);
        setStartGame(data.isStart);
        console.log(data);
        if ( !data.isStart ) {
          window.socket.emit('loginGame', {
            gameID: id,
            username: user.username,
          })
        } else {
          setViewer(true);
          toast.success('Oyun başladı, izleyici olarak katıldın.');
        }
      })
      window.socket.on('count', (data) => {
        setGamerCount({
          viewer: data.viewerCount,
          gamer: data.gamerCount,
        });
      });
      window.socket.on('bufferStart', (data) => {
        setStartBuffer(true);
      });
      window.socket.on('gameStart', (data) => {
        setStartBuffer(false);
        setStartGame(true);
      });
      window.socket.on('gameQuestion', (data) => {
        setShowStats();
        setSelfStats();
        setActiveQuestion(data.id);
      });
      window.socket.on('getStats', (data) => {
        const sortedStats = data.sort((a, b) => b.score - a.score);
        const s = sortedStats.findIndex((st) => st.username === user.username);
        setShowStats(sortedStats);
        setSelfStats({
          index: s,
          ...sortedStats[s],
        })
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
      });
    }

    return () => {
      if ( window.socket ) {
        console.log('cleanup')
        window.socket.removeAllListeners();
        window.socket.close();
        window.socket.off();
        window.socket.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.username])

  const goToHome = () => {
    history.push('/');
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
        {!startGame && !startBuffer ? (
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
            viewer={viewer}
            gamerCount={gamerCount}
          />
        ) : startGame && question ? (
          <Question
            key={question.id}
            viewer={viewer}
            question={question}
            gamerCount={gamerCount}
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
