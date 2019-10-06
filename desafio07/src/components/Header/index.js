import React from 'react';

import { Container, Logo } from './style';

import logo from '../../assets/Logo.svg';

function Header() {
  return (
    <Container>
      <Logo source={logo} />
    </Container>
  );
}

export default Header;
