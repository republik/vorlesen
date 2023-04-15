import { gql, useQuery } from '@apollo/client'

import { useMe } from '../../lib/contexts/me'
import { getVoiceContributors } from '../../lib/utils'

import Repo from './Repo'

const GET_DOCUMENTS = gql`
  query VorlesenGetDocuments($from: DateTime!, $until: DateTime!) {
    reposSearch(
      phases: [proofReading, finalControl, ready, scheduled, published]
      publishDateRange: { from: $from, until: $until }
    ) {
      nodes {
        id
        currentPhase {
          key
        }
        latestCommit {
          id
          date
          document {
            meta {
              title
              format {
                id
                meta {
                  title
                }
              }
              series {
                title
              }
              willBeReadAloud
              contributors {
                kind
                name
                user {
                  id
                }
              }
              audioSource {
                mp3
              }
            }
          }
        }
        latestPublications {
          live
          prepublication
          document {
            id
            meta {
              path
            }
          }
        }
      }
    }
  }
`

function filterNotReadAloud(repo) {
  return repo.latestCommit?.document?.meta?.willBeReadAloud
}

function createFilterNotMeVoice(me) {
  const isEditor = me?.roles?.includes?.('editor')

  return function filterNotMeVoice(repo) {
    if (isEditor) {
      return true
    }

    const voiceContributors = getVoiceContributors(repo.latestCommit?.document)

    if (!voiceContributors?.length) {
      return true
    }

    return !!voiceContributors.find(
      (contributor) => contributor?.user?.id === me?.id,
    )
  }
}

export default function Day({ date }) {
  const { me } = useMe()

  const from = date
  const until = date.endOf('day')

  const options = {
    ssr: false,
    variables: {
      from,
      until,
    },
  }
  const { data, loading: isLoading } = useQuery(GET_DOCUMENTS, options)

  const repos = data?.reposSearch?.nodes
    ?.filter(filterNotReadAloud)
    .filter(createFilterNotMeVoice(me))

  return (
    <>
      {repos?.map((repo) => (
        <Repo key={repo.id} repo={repo} />
      ))}
      {!repos?.length && isLoading && <div>Lade…</div>}
    </>
  )
}
