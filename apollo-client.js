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
  version: '0.3',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default client
