import React from 'react'
import { Box, Heading } from 'grommet'
import styled, { keyframes } from 'styled-components';

const Wrapper = styled(Box)`
  height: 100%;
  background: var(--brand);
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
const PageTitle = styled(Box)`
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
  min-height: 0;
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 100px;
  background: ${props => props.background};
  border-radius: 8px 8px 0 0;
  box-shadow: ${props => props.shadow};
  animation: 450ms ${slideUp} ${props => props.theme.global.easing};
`;

function Page({
  title,
  shadow = '0px -2px 4px rgba(0, 0, 0, 0.20)',
  background = 'var(--light-1)',
  pad = 'large',
  children
}) {
  return (
    <Wrapper overflow="hidden">
      <PageTitle align="center" justify="center">
        <Heading color="light-1" size="small">{title}</Heading>
      </PageTitle>
      <Content flex pad={pad} overflow="auto" shadow={shadow} background={background}>
        {children}
      </Content>
    </Wrapper>
  )
}

export default Page
