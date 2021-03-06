import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { Text, Box } from 'grommet'
import styled from 'styled-components';
import { Howl, Howler } from 'howler';

import Page from '../Page'

import { useAuth } from '../../hooks/use-auth';

import iconSrc from '../../assets/icon.svg';

Howler.autoSuspend = false;

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

const Game = ({ id, name, startDate, startTime, isStart, isFinish, questionSound, questions }) => {
  const history = useHistory();

  const goToGame = () => {
    if ( window.bufferAudio ) {
      window.bufferAudio.play();
      window.bufferAudio.pause();
      window.bufferAudio.currentTime = 0;
    }
    window.gameAudio = new Howl({
      src: [questionSound],
      sprite: questions.reduce((s, question) => {
        const questionStart = question.questionStart * 1000;
        const questionEnd = (question.questionEnd - question.questionStart) * 1000;
        const answerStart = question.answerStart * 1000;
        const answerEnd = (question.answerEnd - question.answerStart) * 1000;
        s[`${question.id}-question`] = [questionStart, questionEnd];
        s[`${question.id}-answer`] = [answerStart, answerEnd];
        return s;
      }, {})
    });
    history.push(`/yarisma/${id}`);
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
  const { setSeenHome } = useAuth();

  useEffect(() => {
    setSeenHome(true);
  }, [setSeenHome]);

  useEffect(() => {
    const fetchGames = async () => {
      if ( fetching ) return;
      setFeching(true);

      try {
        const { data } = await axios.get('https://lolitoys.net/game');
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

  useEffect(() => {
    window.gameAudio && window.gameAudio.stop();
  }, [])

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
