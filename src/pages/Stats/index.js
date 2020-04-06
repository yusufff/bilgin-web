import React from 'react'
import { Box, Heading } from 'grommet'
import * as Icons from 'grommet-icons';

import Page from '../Page'

function Stats() {
  return (
    <Page title="İstatistikler">
      <Box gap="large">
        <Box align="center"><Icons.Clock size="xlarge" color="status-warning" /></Box>
        <Heading level="3" textAlign="center">İstatistiklerin hesaplanıyor. Daha sonra bu sayfada görebilirsin!</Heading>
      </Box>
    </Page>
  )
}

export default Stats
