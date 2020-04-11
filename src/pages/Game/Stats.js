import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Box, Heading, Text, Button } from 'grommet'
import Bottom from './Bottom'
import styled from 'styled-components';
import { Howl } from 'howler';

import StatsShow from '../../assets/stats-show.mp3';
import StatsFinal from '../../assets/stats-final.mp3';

const User = styled(Box)`
  flex-shrink: 0;
  margin-bottom: ${props => props.marginBottom};
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
`;
const StatsWrapper = styled(Box)`
  min-height: 0;
  overflow: auto;
`;

function Stats({
  showFinal,
  showStats,
  selfStats,
  gamerCount,
}) {
  const history = useHistory();

  useEffect(() => {
    const sound = new Howl({
      src: [showFinal ? StatsFinal : StatsShow],
      autoplay: true,
    });

    return () => {
      sound.unload();
    }
  }, [showFinal]);

  const goToHome = () => {
    history.push('/');
  }

  return (
    <>
      <Box align="center" justify="center">
        {showFinal ? (
          <Heading
            level="3"
            textAlign="center"
            margin="small"
          >
            Yarışma bitti! {selfStats && `Tebrikler ${selfStats.index + 1}. oldun`}
          </Heading>
        ) : (
          <Heading
            level="3"
            textAlign="center"
            margin="small"
          >
            Sonraki soru geliyor, hazır ol!
          </Heading>
        )}
        <Heading
          level="4"
          textAlign="center"
        >
          Puanlar
        </Heading>
      </Box>
      <StatsWrapper
        flex
        pad={{ vertical: '10px', horizontal: '10px' }}
        gap="small"
        justify="start"
      >
        {showStats.slice(0, 5).map((gamer, index) => (
          <User
            key={index}
            marginBottom="10px"
            align="center"
          >
            <Text
              size={
                index === 0 ? '25px' : 
                index === 1 ? '21px' :
                index === 2 ? '17px' :
                '13px'
              }
              truncate
            >
              {index + 1}. {gamer.username}
            </Text>
            <Text
              size={
                index === 0 ? '18px' : 
                index === 1 ? '15px' :
                index === 2 ? '12px' :
                '9px'
              }
              color={
                index === 0 ? 'status-ok' : 
                index === 1 ? 'status-warning' :
                index === 2 ? 'status-warning' :
                'status-error'
              }
            >
              {gamer.score}
            </Text>
          </User>
        ))}
      </StatsWrapper>
      {selfStats && (
        <User
          direction="row"
          align="center"
          justify="center"
          gap="medium"
          marginBottom="20px"
        >
          <Text weight="bold" size="17px">
            {selfStats.index + 1}. {selfStats.username}
          </Text>
          <Text
            size="9px"
            color="accent-2"
            weight="bold"
          >
            {selfStats.score}
          </Text>
        </User>
      )}
      {showFinal && (
        <Box pad="medium">
          <Button primary onClick={() => goToHome()} label="ÇIKIŞ" />
        </Box>
      )}
      <Bottom
        gamerCount={gamerCount}
        showCountdown={false}
      />
    </>
  )
}

export default Stats
