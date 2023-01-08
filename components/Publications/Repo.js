import { css } from 'glamor'

import { Button, Interaction } from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '2rem 0 1rem 0',
  }),
  actions: css({
    padding: '1rem 0 0 0',
  }),
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
      Beitrag ansehen
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
      Vorschau
    </Button>
  )
}

export default function Repo({ repo }) {
  const document = repo.latestCommit?.document

  const title = [document?.meta?.format?.meta?.title, document?.meta?.title]
    .filter(Boolean)
    .join(': ')

  return (
    <div {...styles.container}>
      <Interaction.P>{title}</Interaction.P>
      <div {...styles.actions}>
        <PreviewLink repo={repo} />
        <PublicationLink repo={repo} />
      </div>
    </div>
  )
}
