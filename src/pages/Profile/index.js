import React from 'react'
import { Button } from 'grommet'
import { useAuth } from '../../context/use-auth'

function Profile() {
  const { setUser } = useAuth();

  return (
    <div>
      <Button primary size="large" onClick={() => setUser()} label="Çıkış Yap" />
    </div>
  )
}

export default Profile
