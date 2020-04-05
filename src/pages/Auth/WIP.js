import React from 'react'

import Intro from '../../components/Intro';

import AuthWrapper from './AuthWrapper';
import { Heading } from 'grommet';

function Login() {
  return (
    <AuthWrapper>
      <Intro />
      <Heading fill level="2" textAlign="center">Yarışmamız 20:00'da kayıt almaya başlayacak</Heading>
    </AuthWrapper>
  )
}

export default Login
