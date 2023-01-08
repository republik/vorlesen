import { ApolloProvider } from '@apollo/client'
import { ColorContextProvider } from '@project-r/styleguide'

import MeContextProvider from '../components/Me/enhancers'
import LayoutContainer from '../components/Layout/Container'
import '../styles/globals.css'

import client from '../apollo-client'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ColorContextProvider root>
        <MeContextProvider>
          <LayoutContainer>
            <Component {...pageProps} />
          </LayoutContainer>
        </MeContextProvider>
      </ColorContextProvider>
    </ApolloProvider>
  )
}
export default MyApp
