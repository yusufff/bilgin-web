import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Box } from 'grommet';
import * as Icon from 'grommet-icons';

const StyledBox = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
`;

const StyledNavLink = styled(NavLink)`
  border-radius: 50%;
  padding: 8px;
  color: white;
  box-shadow: 0 0 0 10px transparent;
  transition: all 450ms ${props => props.theme.easing};

  &.active {
    box-shadow:
      0 0 0 10px white,
      0px -9px 18px rgba(0,0,0,0.20);
    background-color: white;
    color: var(--brand);
    transform: translateY(-10px);
  }
`;

function BottomTabs() {
  return (
    <StyledBox
      tag="header"
      direction="row"
      align="center"
      justify="around"
      background="brand"
      pad="small"
      elevation="r_medium"
      style={{ zIndex: '1' }}
    >
      <StyledNavLink exact to="/istatistik" activeClassName="active">
        <Icon.Analytics color="currentColor" style={{ display: 'block' }} />
      </StyledNavLink>
      <StyledNavLink exact to="/" activeClassName="active">
        <Icon.Home color="currentColor" style={{ display: 'block' }} />
      </StyledNavLink>
      <StyledNavLink exact to="/profil" activeClassName="active">
        <Icon.User color="currentColor" style={{ display: 'block' }} />
      </StyledNavLink>
    </StyledBox>
  )
}

export default BottomTabs
