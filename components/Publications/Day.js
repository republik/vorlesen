import { gql, useQuery } from '@apollo/client'

import { useMe } from '../Me/enhancers'

import Repo from './Repo'

const GET_DOCUMENTS = gql`
  query GetPublicationsDay($from: DateTime!, $until: DateTime!) {
    reposSearch(
      phases: [scheduled, published]
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
              willBeReadAloud
              contributors {
                kind
                user {
                  id
                }
              }
              format {
                id
                meta {
                  title
                }
              }
              series {
                title
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
  return function filterNotMeVoice(repo) {
    const contributors = repo.latestCommit?.document?.meta?.contributors
    const voiceContributors = contributors?.filter(
      (contributor) => contributor.kind === 'voice',
    )

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
