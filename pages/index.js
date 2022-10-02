import { NarrowContainer } from '@project-r/styleguide'
import Head from 'next/head'

import Calendar from '../components/Calendar'
import Me from '../components/Me'

export default function Index() {
  return (
    <>
      <Head>
        <title>Vorlesen</title>
        <link rel='icon' href='/favicon-32.png' sizes='32x32' />
        <link rel='icon' href='/favicon-128.png' sizes='128x128' />
        <link rel='icon' href='/favicon-192.png' sizes='192x192' />
        <link rel='apple-touch-icon' href='/favicon-180.png' sizes='180x180' />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <NarrowContainer>
        <Me />
        <Calendar />
      </NarrowContainer>
    </>
  )
}
