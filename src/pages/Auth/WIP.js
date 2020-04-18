import React from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from 'grommet';

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
      <Button onClick={goToLogin} primary label="GİRİŞ YAP" margin={{ bottom: '10px' }} />
      <Button onClick={goToRegister} primary label="KAYIT OL" />
    </AuthWrapper>
  )
}

export default Login
