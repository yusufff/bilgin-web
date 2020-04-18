import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Button, Form, TextInput, Paragraph } from 'grommet'
import * as Icons from 'grommet-icons';

import { useAuth } from '../../hooks/use-auth'

import AuthWrapper from './AuthWrapper';

const Input = styled(TextInput)`
  margin-bottom: 12px;
`;
const UserIcon = styled(Icons.FormNext)`
  padding-bottom: 12px;
`;
const PasswordIcon = styled(Icons.FormLock)`
  padding-bottom: 12px;
`;
const loadingAnim = keyframes`
  0%, 100% {
    transform: scale(0.8)
  }
  50% {
    transform: scale(1.2)
  }
`;
const LoadingIcon = styled(Icons.Radial)`
  animation: 1s ${loadingAnim} infinite ${props => props.theme.global.easing};
`;
const SubmitButton = styled(Button)`
  text-align: center;
`;

const LinkWrapper = styled(Paragraph)`
  margin-bottom: 0;
`;
const SignUpLink = styled(Link)`
  text-decoration: none;
`

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, fetchProfile } = useAuth();
  const history = useHistory();

  const login = async () => {
    if (
      loading
      || username === ''
      || password === ''
    ) return;

    setLoading(true);

    try {
      const { data } = await axios.post('https://lolitoys.net/auth/login', {
        username,
        password,
      });
      if ( data.status ) {
        setUser(data.data);
        fetchProfile();
        history.push('/');
      } else {
        setLoading(false);
        toast.error(data?.message || 'Bir hata oluştu, lütfen tekrar dene.');
      }
    } catch({ response }) {
      setLoading(false);
      toast.error('Bir hata oluştu, lütfen tekrar dene.');
    }
  }

  return (
    <AuthWrapper>
      <Form>
        <Input
          icon={<UserIcon />}
          name="username"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          icon={<PasswordIcon />}
          name="password"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <SubmitButton
          primary
          size="large"
          fill="horizontal"
          type="submit"
          label={loading ? null : 'GİRİŞ YAP'}
          icon={loading ? <LoadingIcon /> : null}
          onClick={login}
          disabled={username === '' || password === ''}
        />
        <LinkWrapper fill textAlign="center">
          <SignUpLink to="/kayit">Hesabın yok mu? Hemen oluştur</SignUpLink>
        </LinkWrapper>
      </Form>
    </AuthWrapper>
  )
}

export default Login
