import React from 'react'
import { Button } from 'grommet'

import Page from '../Page';

import { useAuth } from '../../context/use-auth'

function Profile() {
  const { setUser } = useAuth();

  return (
    <Page title="Profil">
      <Button primary size="large" onClick={() => setUser()} label="Çıkış Yap" />
    </Page>
  )
}

export default Profile
