import { createContext, useContext } from 'react'

import { gql, useQuery } from '@apollo/client'

const GET_ME = gql`
  query VorlesenGetMe {
    me {
      id
      name
      email
      roles
      portrait(properties: { height: 96, width: 96 })
    }
  }
`

export const MeContext = createContext()

export const useMe = () => {
  const context = useContext(MeContext)

  return { ...context.me, me: context?.me?.data?.me }
}

export default function MeContextProvider({ children }) {
  const options = { ssr: false }
  const result = useQuery(GET_ME, options)

  return (
    <MeContext.Provider value={{ me: result }}>{children}</MeContext.Provider>
  )
}
