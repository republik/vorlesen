import { createContext, useContext, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { fragmentUser } from '../../components/Calendar/fragments'

const GET_ME = gql`
  query VorlesenGetMe {
    me {
      ...User
    }
  }

  ${fragmentUser}
`

export const MeContext = createContext()

export const useMe = () => useContext(MeContext)

export default function MeContextProvider({ children }) {
  const [isEditorMode, setEditorMode] = useState(false)
  const options = { ssr: false }
  const result = useQuery(GET_ME, options)

  const value = {
    // spread useQuery result props
    // @see https://www.apollographql.com/docs/react/data/queries/#result
    ...result,

    // put query data result into me for easier accessibility
    me: result?.data?.me,

    // return additional flags
    isEditor: !!result?.data?.me?.roles?.includes?.('editor'),
    isEditorMode,
    setEditorMode,
  }

  return <MeContext.Provider value={value}>{children}</MeContext.Provider>
}
