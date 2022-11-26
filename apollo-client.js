import { ApolloClient, InMemoryCache } from '@apollo/client'

const config = {
  typePolicies: {
    CalendarSlot: {
      fields: {
        users: {
          merge: (_, incoming) => incoming,
        },
      },
    },
  },
}

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  cache: new InMemoryCache(config),
  name: 'republik/vorlesen',
  version: '0.1',
})

export default client
