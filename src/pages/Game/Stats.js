import React from 'react'
import { useHistory } from 'react-router-dom';
import { Box, Heading, Text, Button } from 'grommet'
import Bottom from './Bottom'
import styled from 'styled-components';

const User = styled(Box)`
  margin-bottom: ${props => props.marginBottom};
  transform: scale(${props => props.scale});
`;

function Stats({
  showFinal,
  showStats,
  selfStats,
  viewer,
  gamerCount,
}) {
  const history = useHistory();

  const goToHome = () => {
    history.push('/');
  }

  return (
    <>
      <Box align="center" justify="center">
        {showFinal && !viewer ? (
          <Heading
            level="2"
            textAlign="center"
            margin="small"
          >
            Yarışma bitti! Tebrikler {selfStats.index + 1}. oldun
          </Heading>
        ) : showFinal && viewer ? (
          <Heading
            level="2"
            textAlign="center"
            margin="small"
          >
            Yarışma bitti!
          </Heading>
        ) : null}
        <Heading
          level={showFinal ? '3' : '2'}
          textAlign="center"
        >
          Puanlar
        </Heading>
      </Box>
      <Box
        flex
        pad={{ vertical: '40px', horizontal: '40px' }}
        gap="small"
        justify="start"
      >
        {showStats.slice(0, 5).map((gamer, index) => (
          <User
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
          </User>
        ))}
      </Box>
      {selfStats && !viewer && (
        <User
          direction="row"
          scale="1.3"
          align="center"
          justify="center"
          gap="medium"
          marginBottom="20px"
        >
          <Text weight="bold" size="large">
            {selfStats.index + 1}. {selfStats.username}
          </Text>
          <Text
            size="small"
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
