import type Group from './Group'

export default <T>(
  name: string,
  icon: string,
  ...groups: ReturnType<typeof Group>[]
) => Widget.Box({
  class_name: 'page',
  attribute: { name, icon },
  child: Widget.Scrollable({
    css: 'min-height: 300px;',
    child: Widget.Box({
      class_name: 'page-content',
      vexpand: true,
      vertical: true,
      children: groups,
    }),
  }),
})
