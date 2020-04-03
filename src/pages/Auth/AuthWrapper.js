import React from 'react'
import styled, { keyframes } from 'styled-components';
import { Box } from 'grommet'

import logoSvg from '../../assets/logo.svg';

const Wrapper = styled(Box)`
  min-height: 100%;
  background: var(--brand);
`;

const Header = styled(Box)`
  transition: all 450ms ${props => props.theme.global.easing};
`;
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
const Logo = styled.img`
  max-width: 60vw;
  animation: 450ms ${fadeIn} ${props => props.theme.global.easing};
`;

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`
const Content = styled(Box)`
  background: white;
  border-radius: 8px 8px 0 0;
  animation: 450ms ${slideUp} ${props => props.theme.global.easing};
`;

function AuthWrapper({ children }) {
  return (
    <Wrapper flex>
      <Header flex align="center" justify="center">
        <Logo src={logoSvg} />
      </Header>
      <Content pad="large">
        {children}
      </Content>
    </Wrapper>
  )
}

export default AuthWrapper
