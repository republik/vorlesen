import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  Interaction,
} from '@project-r/styleguide'

export const getMessages = (error) => {
  const messages = error?.graphQLErrors
    ?.map((e) => e?.message)
    .map((message, i) => <Interaction.P key={i}>{message}</Interaction.P>)

  if (!messages?.length) {
    return null
  }

  return messages
}

export default function Error({ error, onClose }) {
  const messages = getMessages(error)

  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar onClose={onClose} />
      <OverlayBody>{messages}</OverlayBody>
    </Overlay>
  )
}
