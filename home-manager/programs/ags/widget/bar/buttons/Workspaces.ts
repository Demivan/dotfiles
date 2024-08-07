import options from 'options'
import { range, sh } from 'lib/utils'
import PanelButton from '../PanelButton'

const hyprland = await Service.import('hyprland')
const { workspaces } = options.bar.workspaces

function dispatch(arg: string | number) {
  sh(`hyprctl dispatch workspace ${arg}`)
}

function Workspaces(ws: number) {
  return Widget.Box({
    children: range(ws || 20).map(i => Widget.Label({
      attribute: i,
      vpack: 'center',
      label: `${i}`,
      setup: self => self.hook(hyprland, () => {
        self.toggleClassName('active', hyprland.active.workspace.id === i)
        self.toggleClassName('occupied', (hyprland.getWorkspace(i)?.windows || 0) > 0)
      }),
    })),
    setup: (box) => {
      if (ws === 0) {
        box.hook(hyprland.active.workspace, () => box.children.map((btn) => {
          btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute)
        }))
      }
    },
  })
}

export default () => PanelButton({
  window: 'overview',
  class_name: 'workspaces',
  on_scroll_up: () => dispatch('m+1'),
  on_scroll_down: () => dispatch('m-1'),
  on_clicked: () => App.toggleWindow('overview'),
  child: workspaces.bind().as(Workspaces),
})
