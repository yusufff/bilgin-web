import React, { useState } from 'react'
import { Link } from 'react-router-dom';
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

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, fetchProfile } = useAuth();

  const register = async () => {
    if (
      loading
      || email === ''
      || username === ''
      || password === ''
      || secondPassword === ''
    ) return;

    setLoading(true);

    try {
      const { data } = await axios.post('https://yarismaapi.akbolat.net/auth/register', {
        email,
        username,
        password,
      });
      if ( data.status ) {
        setUser(data.data);
        fetchProfile();
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
          name="email"
          type="email"
          placeholder="E-Posta"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
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
        <Input
          icon={<PasswordIcon />}
          name="secondPassword"
          type="password"
          placeholder="Şifre Tekrar"
          value={secondPassword}
          onChange={(event) => setSecondPassword(event.target.value)}
        />
        <SubmitButton
          primary
          size="large"
          fill="horizontal"
          type="submit"
          label={loading ? null : 'KAYIT OL'}
          icon={loading ? <LoadingIcon /> : null}
          onClick={register}
          disabled={(password !== '' || secondPassword !== '') && password !== secondPassword}
        />
        <LinkWrapper fill textAlign="center">
          <SignUpLink to="/giris">Hesabın var mı? Hemen giriş yap</SignUpLink>
        </LinkWrapper>
      </Form>
    </AuthWrapper>
  )
}

export default Register
