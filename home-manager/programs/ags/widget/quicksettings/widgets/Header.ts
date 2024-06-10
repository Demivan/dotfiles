import icons from 'lib/icons'
import { uptime } from 'lib/variables'
import options from 'options'
import type { Action } from 'service/powermenu'
import powermenu from 'service/powermenu'

const battery = await Service.import('battery')
const { image, size } = options.quicksettings.avatar

function up(up: number) {
  const h = Math.floor(up / 60)
  const m = Math.floor(up % 60)
  return `${h}h ${m < 10 ? `0${m}` : m}m`
}

function Avatar() {
  return Widget.Box({
    class_name: 'avatar',
    css: Utils.merge([image.bind(), size.bind()], (img, size) => `
        min-width: ${size}px;
        min-height: ${size}px;
        background-image: url('${img}');
        background-size: cover;
    `),
  })
}

function SysButton(action: Action) {
  return Widget.Button({
    vpack: 'center',
    child: Widget.Icon(icons.powermenu[action]),
    on_clicked: () => powermenu.action(action),
  })
}

export function Header() {
  return Widget.Box(
    { class_name: 'header horizontal' },
    Avatar(),
    Widget.Box({
      vertical: true,
      vpack: 'center',
      children: [
        Widget.Box({
          visible: battery.bind('available'),
          children: [
            Widget.Icon({ icon: battery.bind('icon_name') }),
            Widget.Label({ label: battery.bind('percent').as(p => `${p}%`) }),
          ],
        }),
        Widget.Box([
          Widget.Icon({ icon: icons.ui.time }),
          Widget.Label({ label: uptime.bind().as(up) }),
        ]),
      ],
    }),
    Widget.Box({ hexpand: true }),
    Widget.Button({
      vpack: 'center',
      child: Widget.Icon(icons.ui.settings),
      on_clicked: () => {
        App.closeWindow('quicksettings')
        App.closeWindow('settings-dialog')
        App.openWindow('settings-dialog')
      },
    }),
    SysButton('logout'),
    SysButton('shutdown'),
  )
}
