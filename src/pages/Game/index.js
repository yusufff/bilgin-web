import React, { useEffect } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { Box, Heading } from 'grommet';
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';

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
const PageTitle = styled(Box)`
  
`;

const BackIcon = styled(Icons.Previous)`

`;
const ConnectedIcon = styled(Icons.Wifi)`

`;
const DisconnectedIcon = styled(Icons.WifiNone)`

`

function Game() {
  const { id } = useParams();
  const { state } = useLocation();
  const history = useHistory();
  const { setShowTabs } = useAuth();
  const [socket] = useSocket('http://localhost:8000');

  useEffect(() => {
    setShowTabs(false);

    return () => {
      setShowTabs(true);
    }
  }, [setShowTabs]);

  const goToHome = () => {
    history.push('/');
  }

  return (
    <Wrapper flex background="neutral-5">
      <PageTitle direction="row" align="center" justify="between" pad={{ vertical: '8px' }}>
        <Box
          flex={{ shrink: 0 }}
          pad="medium"
          onClick={goToHome}
        >
          <BackIcon color="light-1" />
        </Box>

        <Box>
          <Heading
            fill
            color="light-1"
            size="16px"
            textAlign="center"
            truncate
          >
            {state?.title}
          </Heading>
        </Box>

        <Box
          flex={{ shrink: 0 }}
          pad="medium"
        >
          <ConnectedIcon color="light-1" />
        </Box>
      </PageTitle>
    </Wrapper>
  )
}

export default Game
