import PopupWindow from 'widget/PopupWindow'
import options from 'options'
import NotificationColumn from './NotificationColumn'
import DateColumn from './DateColumn'

import '../../style/widgets/datemenu.scss'

const { bar, datemenu } = options
const pos = bar.position.bind()
const layout = Utils.derive([bar.position, datemenu.position], (bar, qs) =>
    `${bar}-${qs}` as const)

function Settings() {
  return Widget.Box({
    class_name: 'datemenu horizontal',
    vexpand: false,
    children: [
      NotificationColumn(),
      Widget.Separator({ orientation: 1 }),
      DateColumn(),
    ],
  })
}

function DateMenu() {
  return PopupWindow({
    name: 'datemenu',
    exclusivity: 'exclusive',
    transition: pos.as(pos => pos === 'top' ? 'slide_down' : 'slide_up'),
    layout: layout.value,
    child: Settings(),
  })
}

export function setupDateMenu() {
  App.addWindow(DateMenu())
  layout.connect('changed', () => {
    App.removeWindow('datemenu')
    App.addWindow(DateMenu())
  })
}
