import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { Box, Heading, Text } from 'grommet';
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';

import { useAuth } from '../../hooks/use-auth';
import { useSocket } from '../../hooks/use-socket';
import axios from 'axios';
import { toast } from 'react-toastify';

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

  const [socket] = useSocket('http://localhost:8000');
  const [connected, setConnected] = useState();
  const [gamerCount, setGamerCount] = useState(0);
  const [startBuffer, setStartBuffer] = useState();
  const [startGame, setStartGame] = useState();
  const [question, setQuestion] = useState();
  const [showStats, setShowStats] = useState();
  const [showFinal, setShowFinal] = useState();

  useEffect(() => {
    if ( socket ) {
      socket.emit('loginGame', {
        gameID: id,
        username: user.username,
      })
      socket.on('connect', () => {
        setConnected(true);
        console.log('connected', socket)
      });
      socket.on('disconnect', () => {
        setConnected(false);
        console.log('disconnected', socket)
      });
      socket.on('gamerCount', (data) => {
        setGamerCount(data);
        console.log('gamerCount', data)
      });
      socket.on('startBuffer', (data) => {
        setStartBuffer(data);
        console.log('startBuffer', data)
      });
      socket.on('startGame', (data) => {
        setStartGame(data);
        console.log('startGame', data)
      });
      socket.on('getQuestion', (data) => {
        setQuestion(data);
        console.log('getQuestion', data)
      });
      socket.on('getStats', (data) => {
        setShowStats(data);
        console.log('getStats', data)
      });
      socket.on('startLastStats', (data) => {
        setShowFinal(data);
        console.log('startLastStats', data)
      });
    }
  }, [socket, id, user])

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

      <ContentWrapper>
        
      </ContentWrapper>
    </Wrapper>
  )
}

export default Game
