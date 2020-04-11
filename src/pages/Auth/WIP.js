import React from 'react'
import { useHistory } from 'react-router-dom';
import { Heading, Button } from 'grommet';

import Intro from '../../components/Intro';

import AuthWrapper from './AuthWrapper';

function Login() {
  const history = useHistory();

  const goToLogin = () => {
    history.push('/giris');
  }
  const goToRegister = () => {
    history.push('/kayit');
  }

  return (
    <AuthWrapper>
      <Intro />
      <Heading fill level="3" textAlign="center">Yarışmamız 12 Nisan Pazar günü 20:00'da başlayacaktır</Heading>
      <Button onClick={goToLogin} primary label="GİRİŞ YAP" margin={{ bottom: '10px' }} />
      <Button onClick={goToRegister} primary label="KAYIT OL" />
    </AuthWrapper>
  )
}

export default Login
