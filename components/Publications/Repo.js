import { css, merge } from 'glamor'

import { Button, Interaction, useColorContext } from '@project-r/styleguide'

import { getDayjs, getDocUrl } from '../../lib/utils'

const styles = {
  margin: css({
    marginBottom: '1rem',
  }),
}

function Link({ repo, children, ...props }) {
  const url = getDocUrl(repo)

  return (
    <Button href={url} target='_blank' {...props}>
      {children}
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

  const headline =
    document?.meta?.format?.meta?.title || document?.meta?.series?.title
  const title = document?.meta?.title

  const linkLabel =
    (state === 'not-ready' && 'Nicht bereit: Ansehen') ||
    (state === 'ready' && 'Bereit: Vorlesen') ||
    'Öffnen'

  return (
    <div {...styles.margin}>
      <div {...styles.margin}>
        <Interaction.P>
          {headline && <span {...headlineStyle}>{headline} </span>}
          {title}
        </Interaction.P>
      </div>
      <div {...styles.margin}>
        <Link repo={repo} primary={state === 'ready'}>
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}
