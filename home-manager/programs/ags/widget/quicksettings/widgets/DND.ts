import icons from 'lib/icons'
import { SimpleToggleButton } from '../ToggleButton'

const n = await Service.import('notifications')
const dnd = n.bind('dnd')

export function DND() {
  return SimpleToggleButton({
    icon: dnd.as(dnd => icons.notifications[dnd ? 'silent' : 'noisy']),
    label: dnd.as(dnd => dnd ? 'Silent' : 'Noisy'),
    toggle: () => n.dnd = !n.dnd,
    connection: [n, () => n.dnd],
  })
}
