import { css } from 'glamor'

import { Label } from '@project-r/styleguide'

const styles = {
  label: css({
    padding: '1rem 0',
    textTransform: 'uppercase',
  }),
  item: css({
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: '1rem',
  }),
}

export default function Stats({ slots }) {
  const users = slots
    .map((slot) => slot.users)
    .flat()
    .reduce((prev, curr) => {
      const user = prev.find((p) => p.id === curr.id) || curr

      const users = prev.filter((p) => p.id !== user.id)
      users.push({ ...user, slots: user.slots ? user.slots + 1 : 1 })

      return users
    }, [])
    .sort((a, b) => b.slots - a.slots)

  return (
    <>
      <div {...styles.label}>
        <Label>Statistik</Label>
      </div>
      {users.map((user) => {
        return (
          <div key={user.id} {...styles.item}>
            <div>
              {user.slots} Slots: {user.name} {user.initials}
            </div>
          </div>
        )
      })}
    </>
  )
}
