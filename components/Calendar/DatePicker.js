import {
  ChevronLeftIcon,
  ChevronRightIcon,
  IconButton,
  Interaction,
} from '@project-r/styleguide'
import { css } from 'glamor'

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '3rem',
    marginBottom: '1rem',
  }),
  clickable: css({
    cursor: 'pointer',
    padding: '0 1rem',
  }),
}

export default function DatePicker({ date, onPick }) {
  const previousMonth = date.clone().startOf('month').subtract(1, 'month')
  const nextMonth = date.clone().startOf('month').add(1, 'month')

  const onClickPrevious = () => {
    onPick(previousMonth.clone())
  }

  const onClickNext = () => {
    onPick(nextMonth.clone())
  }

  return (
    <div {...styles.container}>
      <IconButton
        title={previousMonth.format('MMMM YYYY')}
        Icon={ChevronLeftIcon}
        onClick={onClickPrevious}
      />
      <Interaction.P>{date.format('MMMM YYYY')}</Interaction.P>
      <IconButton
        title={nextMonth.format('MMMM YYYY')}
        Icon={ChevronRightIcon}
        onClick={onClickNext}
      />
    </div>
  )
}
