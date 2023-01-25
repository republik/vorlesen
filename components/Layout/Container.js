import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { css } from 'glamor'

import { Scroller, TabButton, NarrowContainer } from '@project-r/styleguide'

const styles = {
  tabsContainer: css({
    padding: '0 0 1rem 0',
  }),
}

const tabs = [
  { text: 'Startseite', route: '/' },
  { text: 'Kalender', route: '/calendar' },
  { text: 'Beiträge', route: '/publications' },
]

export default function Layout({ children }) {
  const [tab, setTab] = useState()
  const router = useRouter()

  useEffect(() => {
    setTab(tabs.findIndex((tab) => tab.route === router.pathname))
  }, [router.pathname])

  return (
    <NarrowContainer>
      <Head>
        <title>Vorlesen</title>
        <link rel='icon' href='/favicon-32.png' sizes='32x32' />
        <link rel='icon' href='/favicon-128.png' sizes='128x128' />
        <link rel='icon' href='/favicon-192.png' sizes='192x192' />
        <link rel='apple-touch-icon' href='/favicon-180.png' sizes='180x180' />
        <meta name='robots' content='noindex,nofollow' />
      </Head>
      <div {...styles.tabsContainer}>
        <Scroller activeChildIndex={tab}>
          {tabs?.map(({ text, route }, index) => (
            <TabButton
              key={`nav-tab-${index}`}
              text={text}
              isActive={tab === index}
              onClick={() => router.push(route)}
            />
          ))}
        </Scroller>
      </div>
      {children}
    </NarrowContainer>
  )
}
