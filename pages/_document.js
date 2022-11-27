import Document, { Html, Head, Main, NextScript } from 'next/document'
import { renderStaticOptimized } from 'glamor/server'

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    const page = renderPage()
    const styles = renderStaticOptimized(() => page.html)

    return { ...page, ...styles }
  }

  render() {
    const { css } = this.props
    return (
      <Html lang='de'>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='referrer' content='no-referrer' />
          {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
