import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { Text, Box } from 'grommet'
import styled from 'styled-components';

import Page from '../Page'

import iconSrc from '../../assets/icon.svg';
import { useHistory } from 'react-router-dom';

const GameWrapper = styled(Box)`
  position: relative;
`;
const Icon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%; height: auto;
  opacity: .1;
`;

const Game = ({ id, name, startDate, startTime, isStart, isFinish, questionSound }) => {
  const history = useHistory();

  const goToGame = () => {
    if ( window.bufferAudio ) {
      window.bufferAudio.play();
      window.bufferAudio.pause();
      window.bufferAudio.currentTime = 0;
    }
    //window.gameAudio = new Audio(questionSound);
    history.push(`/yarisma/${id}`, {
      title: name
    });
  }

  return (
    <GameWrapper
      flex
      elevation="small"
      pad="medium"
      round="small"
      background="dark-1"
      alignContent="center"
      border={isStart || isFinish ? {
        color: isStart ? 'status-ok' : 'status-warning',
        size: 'large'
      } : null}
      onClick={goToGame}
    >
      <Box margin={{ bottom: '80%' }} flex><Text textAlign="center" size="medium" weight={600}>{name}</Text></Box>
      <Box><Icon src={iconSrc} /></Box>
      <Text textAlign="center" size="small">{startDate}</Text>
      <Text textAlign="center" size="small">{startTime}</Text>
    </GameWrapper>
  )
}

function Home() {
  const [fetching, setFeching] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      if ( fetching ) return;
      setFeching(true);

      try {
        const { data } = await axios.get('https://yarismaapi.akbolat.net/game');
        if ( data.status && data.data ) {
          setGames(data.data.id ? [data.data] : data.data.filter((game) => game.isActive));
          setFeching(false);
        } else {
          toast.error(data?.message || 'Bir hata oluştu, lütfen tekrar dene.');
          setFeching(false);
        }
      } catch ({ response }) {
        toast.error('Bir hata oluştu, lütfen tekrar dene.');
        setFeching(false);
      }
    };
    fetchGames();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Yarışmalar" pad="medium">
      <Box direction="row" gap="small">
        {games.map((game) => (
          <Game key={game.id} {...game} />
        ))}
      </Box>
    </Page>
  )
}

export default Home
