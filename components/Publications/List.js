import { css } from 'glamor'

import { gql, useQuery } from '@apollo/client'
import { Interaction } from '@project-r/styleguide'

import { useMe } from '../../lib/contexts/me'
import {
  getDayjs,
  filterNotReadAloud,
  createFilterNotMeVoice,
} from '../../lib/utils'

import Item from './Item'

const GET_REPOS = gql`
  query VorlesenGetRepos($first: Int, $from: DateTime!, $until: DateTime!) {
    reposSearch(
      first: $first
      phases: [proofReading, finalControl, ready, scheduled, published]
      publishDateRange: { from: $from, until: $until }
    ) {
      nodes {
        id
        meta {
          publishDate
        }
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

const styles = {
  container: css({
    marginBottom: '2rem',
  }),
  date: css({
    marginBottom: '1rem',
  }),
  nothing: css({
    marginBottom: '1rem',
  }),
  repo: css({
    marginBottom: '1rem',
  }),
}

export default function Repos({ slots, anchor }) {
  const { me, isEditorMode } = useMe()

  const options = {
    ssr: false,
    variables: {
      first: 5 * 7,
      from: anchor.toISOString(),
      until: anchor.add(7, 'days').endOf('day').toISOString(),
    },
  }
  const { data, loading } = useQuery(GET_REPOS, options)

  if (loading) {
    return <>Lade…</>
  }

  const repos = data?.reposSearch?.nodes
    ?.filter(filterNotReadAloud)
    .filter(createFilterNotMeVoice(me, isEditorMode))

  return (
    <>
      {slots.map((slot) => {
        const date = getDayjs(slot.key)

        const datesRepos = repos.filter((repo) =>
          getDayjs(repo?.meta?.publishDate).isSame(date, 'day'),
        )

        return (
          <div key={slot.key} {...styles.container}>
            <div {...styles.date}>
              <Interaction.H3>{date.format('dddd, D. MMMM')}</Interaction.H3>
              {isEditorMode && (
                <Interaction.P>
                  {slot.users.map((user) => user.name).join(', ')}
                  {!slot?.users?.length && 'unbelegt'}
                </Interaction.P>
              )}
            </div>
            {!datesRepos.length && (
              <div {...styles.nothing}>
                <Interaction.P>Keine vorzulesenden Beiträge</Interaction.P>
              </div>
            )}
            {datesRepos.map((repo) => (
              <div key={repo.id} {...styles.repo}>
                <Item repo={repo} />
              </div>
            ))}
            {/* <pre>{JSON.stringify(datesRepos, null, 2)}</pre> */}
          </div>
        )
      })}
    </>
  )
}
