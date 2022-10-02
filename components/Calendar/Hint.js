import { css } from 'glamor'
import { useColorContext, Interaction } from '@project-r/styleguide'

const styles = {
  hint: css({
    padding: '1rem',
    margin: '2rem 0',
  }),
}

export default function Hint({ children }) {
  const [colorScheme] = useColorContext()

  return (
    <div {...styles.hint} {...colorScheme.set('backgroundColor', 'alert')}>
      <Interaction.P>{children}</Interaction.P>
    </div>
  )
}
