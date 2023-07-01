import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  Interaction,
} from '@project-r/styleguide'

export const getMessages = (error, Component) => {
  const messages = error?.graphQLErrors
    ?.map((e) => e?.message)
    .map((message, i) => <Component key={i}>{message}</Component>)

  if (!messages?.length) {
    return null
  }

  return messages
}

export default function Error({ error, onClose }) {
  const messages = getMessages(error, Interaction.P)

  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar onClose={onClose} />
      <OverlayBody>{messages}</OverlayBody>
    </Overlay>
  )
}
