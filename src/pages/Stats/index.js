import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
//import { toast } from 'react-toastify';
import { Box, Tabs, Tab, Grommet, grommet, Text } from 'grommet'
import { deepMerge } from 'grommet/utils';
import styled, { css } from 'styled-components';

import Page from '../Page'

const customTheme = deepMerge(grommet, {
  global: {
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  tab: {
    active: {
      background: "brand",
      color: "light-2"
    },
    background: undefined,
    border: undefined,
    color: "dark-2",
    pad: {
      bottom: undefined,
      vertical: "small",
      horizontal: "medium",
    },
    margin: {
      vertical: 0,
      horizontal: 0,
    },
    extend: ({ theme }) => css`
      border-radius: 9999px;
      transition: all 450ms var(--easing);

      & span {
        font-size: 14px;
      }
    `
  },
  tabs: {
    gap: undefined,
  }
});

const PodiumWrapper = styled(Box)`
  height: 250px;
`;
const PodiumUser = styled(Box)`

`;
const ListUser = styled(Box)`

`;

function Stats() {
  const [breakdown, setBreakdown] = useState('month');
  const [fetching, setFeching] = useState(false);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if ( fetching ) return;
      setFeching(true);

      try {
        const { data } = await axios.get(`https://yarismaapi.akbolat.net/stats/${breakdown}`);
        if ( data.status && data.data ) {
          const sortedData = data.data.sort((a, b) => b.scor - a.scor);
          setStats(sortedData);
          setFeching(false);
        } else {
          //toast.error(data?.message || 'Bir hata oluştu, lütfen tekrar dene.');
          setFeching(false);
        }
      } catch ({ response }) {
        //toast.error('Bir hata oluştu, lütfen tekrar dene.');
        setFeching(false);
      }
    };
    fetchStats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdown]);

  const tabs = useMemo(() => [
    {
      title: 'Bu Ay',
      breakdown: 'month',
    },
    {
      title: 'Bu Yıl',
      breakdown: 'year',
    },
    {
      title: 'Tüm Zamanlar',
      breakdown: 'all',
    },
  ], []);

  return (
    <Page title="İstatistikler">
      <Grommet theme={customTheme} background="transparent">
        <Tabs
          activeIndex={tabs.findIndex(tab => tab.breakdown === breakdown)}
          onActive={(index) => setBreakdown(tabs[index].breakdown)}
        >
          {tabs.map(tab => (
            <Tab
              key={tab.breakdown}
              title={tab.title}
            >
              <Box
                fill
                overflow="auto"
              >
                <PodiumWrapper
                  flex
                  direction="row"
                  gap="medium"
                  pad={{
                    vertical: 'xlarge'
                  }}
                >
                  {stats.slice(0, 3).map((stat, index) => (
                    <PodiumUser
                      key={`${index}-${stat.username}`}
                      flex
                      gap="small"
                      pad={{
                        top: `${index * 20}px`
                      }}
                    >
                      <Text
                        size="small"
                        textAlign="center"
                        truncate
                      >
                        {stat.username}
                      </Text>
                      <Box
                        pad={{
                          horizontal: 'medium',
                          vertical: 'xsmall'
                        }}
                        round="xlarge"
                        background="brand"
                        alignSelf="center"
                      >
                        <Text
                          size="xsmall"
                          textAlign="center"
                        >
                          {stat.scor}
                        </Text>
                      </Box>
                      <Box
                        flex
                        background="light-4"
                        align="center"
                        justify="center"
                      >
                        <Text
                          size="xxlarge"
                          color="dark-6"
                        >
                          {index + 1}
                        </Text>
                      </Box>
                    </PodiumUser>
                  ))}
                </PodiumWrapper>
                {stats.slice(3, stats.length).map((stat, index) => (
                  <ListUser
                    key={`${index + 4}-${stat.username}`}
                    flex
                    direction="row"
                    gap="small"
                    pad={{
                      vertical: 'medium',
                    }}
                    align="center"
                  >
                    <Box>
                      <Text
                        size="small"
                      >
                        {index + 4}.
                      </Text>
                    </Box>
                    <Box fill>
                      <Text
                        size="medium"
                        truncate
                      >
                        {stat.username}
                      </Text>
                    </Box>
                    <Box>
                      <Box
                        pad={{
                          horizontal: 'medium',
                          vertical: 'xsmall'
                        }}
                        round="xlarge"
                        background="brand"
                        align="center"
                      >
                        <Text
                          size="xsmall"
                          textAlign="center"
                        >
                          {stat.scor}
                        </Text>
                      </Box>
                    </Box>
                  </ListUser>
                ))}
              </Box>
            </Tab>
          ))}
        </Tabs>
      </Grommet>
    </Page>
  )
}

export default Stats
