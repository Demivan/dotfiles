import PopupWindow from 'widget/PopupWindow'
import options from 'options'
import { range } from 'lib/utils'
import Workspace from './Workspace'

import '../../style/widgets/overview.scss'

const hyprland = await Service.import('hyprland')

function Overview(ws: number) {
  return Widget.Box({
    class_name: 'overview horizontal',
    children: ws > 0
      ? range(ws).map(Workspace)
      : hyprland.workspaces
        .map(({ id }) => Workspace(id))
        .sort((a, b) => a.attribute.id - b.attribute.id),

    setup: (w) => {
      if (ws > 0)
        return

      w.hook(hyprland, (w, id?: string) => {
        if (id === undefined)
          return

        w.children = w.children
          .filter(ch => ch.attribute.id !== Number(id))
      }, 'workspace-removed')
      w.hook(hyprland, (w, id?: string) => {
        if (id === undefined)
          return

        w.children = [...w.children, Workspace(Number(id))]
          .sort((a, b) => a.attribute.id - b.attribute.id)
      }, 'workspace-added')
    },
  })
}

export default () => PopupWindow({
  name: 'overview',
  layout: 'center',
  child: options.overview.workspaces.bind().as(Overview),
})
