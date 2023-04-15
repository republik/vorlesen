import { css, merge } from 'glamor'

import { Button, Interaction, useColorContext } from '@project-r/styleguide'

import { getDayjs, getVoiceContributors } from '../../lib/utils'
import { useMemo } from 'react'

const styles = {
  container: css({
    padding: '2rem 0 1rem 0',
  }),
  actions: css({
    padding: '1rem 0 0 0',
  }),
  state: css({
    margin: '1rem 0 1rem 0',
    padding: '.5rem 1rem',
  }),
  headline: css({}),
}

function PublicationLink({ repo }) {
  if (!process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT) {
    return null
  }

  const publication = repo.latestPublications?.find(
    (publication) => !publication.prepublication && publication.live,
  )

  if (!publication) {
    return null
  }

  const publicationUrl =
    repo.currentPhase.key === 'published' &&
    publication &&
    new URL(
      publication.document?.meta?.path,
      process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT,
    ).toString()

  return (
    <Button href={publicationUrl.toString()} target='_blank'>
      Öffnen
    </Button>
  )
}

function PreviewLink({ repo }) {
  if (!process.env.NEXT_PUBLIC_PUBLIKATOR_ENDPOINT) {
    return null
  }

  const publication = repo.latestPublications?.find(
    (publication) => !publication.prepublication && publication.live,
  )

  if (publication) {
    return null
  }

  const previewUrl = new URL(
    ['repo', repo.id, 'preview'].join('/'),
    process.env.NEXT_PUBLIC_PUBLIKATOR_ENDPOINT,
  )
  previewUrl?.searchParams.set('commitId', repo.latestCommit.id)

  return (
    <Button href={previewUrl.toString()} target='_blank'>
      Öffnen
    </Button>
  )
}

export default function Repo({ repo }) {
  const [colorScheme] = useColorContext()

  const document = repo.latestCommit?.document
  const hasAudioFile = !!document?.meta?.audioSource?.mp3

  const state =
    (['proofReading', 'finalControl', 'ready'].includes(
      repo.currentPhase.key,
    ) &&
      !hasAudioFile &&
      'not-ready') ||
    (repo.currentPhase.key === 'scheduled' &&
      getDayjs().diff(repo.latestCommit.date, 'minute') < 30 &&
      !hasAudioFile &&
      'not-ready') ||
    (['scheduled', 'published'].includes(repo.currentPhase.key) &&
      !hasAudioFile &&
      'ready') ||
    (hasAudioFile && 'done') ||
    'unkown'

  const headlineStyle = merge(
    styles.headline,
    colorScheme.set('color', 'textSoft'),
  )

  const stateStyle = useMemo(() => {
    const backgroundColor =
      (state === 'not-ready' && 'error') ||
      (state === 'ready' && 'primary') ||
      (state === 'done' && 'alert') ||
      'disabled'

    const color = (state === 'done' && 'text') || 'white'

    return merge(
      styles.state,
      colorScheme.set('color', color),
      colorScheme.set('backgroundColor', backgroundColor),
    )
  }, [state])

  const headline =
    document?.meta?.format?.meta?.title || document?.meta?.series?.title
  const title = document?.meta?.title

  const voiceContributors = getVoiceContributors(document)
    ?.map((contributor) => contributor?.name)
    .join(', ')

  return (
    <div {...styles.container}>
      <div {...stateStyle}>
        <Interaction.P>
          {state === 'not-ready' && <>Beitrag noch unfertig</>}
          {state === 'ready' && <>Beitrag bereit für Vorlesen</>}
          {state === 'done' && <>Gelesen von {voiceContributors}</>}
          {state === 'unkown' && <>(unklar, ob parat)</>}
        </Interaction.P>
      </div>
      <Interaction.P>
        {headline && <span {...headlineStyle}>{headline} </span>}
        {title}
      </Interaction.P>
      <div {...styles.actions}>
        <PreviewLink repo={repo} primary={state === 'ready'} />
        <PublicationLink repo={repo} primary={state === 'ready'} />
      </div>
    </div>
  )
}
