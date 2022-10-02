import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  Interaction,
} from '@project-r/styleguide'

export default function Error({ error, onClose }) {
  const messages = error?.graphQLErrors
    ?.map((e) => e?.message)
    .map((message, i) => <Interaction.P key={i}>{message}</Interaction.P>)

  if (!messages?.length) {
    return null
  }

  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar onClose={onClose} />
      <OverlayBody>{messages}</OverlayBody>
    </Overlay>
  )
}
