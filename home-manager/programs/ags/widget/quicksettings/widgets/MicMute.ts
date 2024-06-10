import icons from 'lib/icons'
import { SimpleToggleButton } from '../ToggleButton'

const { microphone } = await Service.import('audio')

function icon() {
  return microphone.is_muted || microphone.stream?.is_muted
    ? icons.audio.mic.muted
    : icons.audio.mic.high
}

function label() {
  return microphone.is_muted || microphone.stream?.is_muted
    ? 'Muted'
    : 'Unmuted'
}

export function MicMute() {
  return SimpleToggleButton({
    icon: Utils.watch(icon(), microphone, icon),
    label: Utils.watch(label(), microphone, label),
    toggle: () => microphone.is_muted = !microphone.is_muted,
    connection: [microphone, () => microphone?.is_muted || false],
  })
}
