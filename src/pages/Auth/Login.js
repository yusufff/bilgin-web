import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Form, TextInput, Paragraph } from 'grommet'
import * as Icons from 'grommet-icons';

import { useAuth } from '../../context/use-auth'

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

const LinkWrapper = styled(Paragraph)`
  margin-bottom: 0;
`;
const SignUpLink = styled(Link)`
  text-decoration: none;
`

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();

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
        <Button
          primary
          size="large"
          fill="horizontal"
          type="submit"
          label="GİRİŞ YAP"
          onClick={() => setUser({ username })}
        />
        <LinkWrapper fill="horizontal" textAlign="center">
          <SignUpLink to="/kayit">Hesabın yok mu? Hemen oluştur</SignUpLink>
        </LinkWrapper>
      </Form>
    </AuthWrapper>
  )
}

export default Login
