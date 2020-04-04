import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button, Form, TextInput } from 'grommet'
import * as Icons from 'grommet-icons';
import styled, { keyframes } from 'styled-components';

import Page from '../Page';

import { useAuth } from '../../hooks/use-auth'

const Input = styled(TextInput)`
  margin-bottom: 12px;
`;
const EmailIcon = styled(Icons.MailOption)`
  padding-bottom: 12px;
`;
const UserIcon = styled(Icons.User)`
  padding-bottom: 12px;
`;
const PhoneIcon = styled(Icons.Phone)`
  padding-bottom: 12px;
`;
const PasswordIcon = styled(Icons.Lock)`
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
  margin-bottom: 48px;
  text-align: center;
`;

function Profile() {
  const { user, setUser, fetchProfile } = useAuth();
  const [email, setEmail] = useState(user.email || '');
  const [username, setUsername] = useState(user.username || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (
      loading
      || email === ''
      || username === ''
    ) return;

    setLoading(true);

    try {
      const { data } = await axios.put('https://yarismaapi.akbolat.net/auth/profile', {
        id: user.id,
        email,
        username,
        phone: phone !== '' ? phone : undefined,
        password: password !== '' ? password : undefined,
      });
      if ( data.status ) {
        setUser(data.data);
        fetchProfile();
        toast.success('Profilin güncellendi.');
      } else {
        toast.error(data?.message || 'Bir hata oluştu, lütfen tekrar dene.');
      }
      setLoading(false);
    } catch({ response }) {
      setLoading(false);
      toast.error('Bir hata oluştu, lütfen tekrar dene.');
    }
  }

  return (
    <Page title="Profil">
      <Form>
        <Input
          icon={<EmailIcon />}
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
          icon={<PhoneIcon />}
          name="phone"
          type="phone"
          placeholder="Telefon Numarası"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
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
          label={loading ? null : 'KAYDET'}
          icon={loading ? <LoadingIcon /> : null}
          onClick={save}
          disabled={(password !== '' || secondPassword !== '') && password !== secondPassword}
        />
      </Form>
      <Button primary size="large" onClick={() => setUser()} label="Çıkış Yap" />
    </Page>
  )
}

export default Profile
