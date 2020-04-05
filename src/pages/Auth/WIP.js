import React from 'react'

import Intro from '../../components/Intro';

import AuthWrapper from './AuthWrapper';
import { Heading } from 'grommet';

function Login() {
  return (
    <AuthWrapper>
      <Intro />
      <Heading fill level="2" textAlign="center">Teknik aksaklıklardan dolayı kayıtlar 6 Nisan 18.30'da açılacaktır. Yarışma 21:00'da başlayacaktır</Heading>
    </AuthWrapper>
  )
}

export default Login
