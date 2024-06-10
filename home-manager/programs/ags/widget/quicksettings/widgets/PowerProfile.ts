import icons from 'lib/icons'

import asusctl from 'service/asusctl'
import { ArrowToggleButton, Menu } from '../ToggleButton'

const asusprof = asusctl.bind('profile')

function AsusProfileToggle() {
  return ArrowToggleButton({
    name: 'asusctl-profile',
    icon: asusprof.as(p => icons.asusctl.profile[p]),
    label: asusprof,
    connection: [asusctl, () => asusctl.profile !== 'Balanced'],
    activate: () => asusctl.setProfile('Quiet'),
    deactivate: () => asusctl.setProfile('Balanced'),
    activateOnArrow: false,
  })
}

function AsusProfileSelector() {
  return Menu({
    name: 'asusctl-profile',
    icon: asusprof.as(p => icons.asusctl.profile[p]),
    title: 'Profile Selector',
    content: [
      Widget.Box({
        vertical: true,
        hexpand: true,
        children: [
          Widget.Box({
            vertical: true,
            children: asusctl.profiles.map(prof => Widget.Button({
              on_clicked: () => asusctl.setProfile(prof),
              child: Widget.Box({
                children: [
                  Widget.Icon(icons.asusctl.profile[prof]),
                  Widget.Label(prof),
                ],
              }),
            })),
          }),
        ],
      }),
      Widget.Separator(),
      Widget.Button({
        on_clicked: () => Utils.execAsync('rog-control-center'),
        child: Widget.Box({
          children: [
            Widget.Icon(icons.ui.settings),
            Widget.Label('Rog Control Center'),
          ],
        }),
      }),
    ],
  })
}

const pp = await Service.import('powerprofiles')
const profile = pp.bind('active_profile')
const profiles = pp.profiles.map(p => p.Profile)

function pretty(str: string) {
  return str
    .split('-')
    .map(str => `${str.at(0)?.toUpperCase()}${str.slice(1)}`)
    .join(' ')
}

function PowerProfileToggle() {
  return ArrowToggleButton({
    name: 'asusctl-profile',
    icon: profile.as(p => icons.powerprofile[p]),
    label: profile.as(pretty),
    connection: [pp, () => pp.active_profile !== profiles[1]],
    activate: () => pp.active_profile = profiles[0],
    deactivate: () => pp.active_profile = profiles[1],
    activateOnArrow: false,
  })
}

function PowerProfileSelector() {
  return Menu({
    name: 'asusctl-profile',
    icon: profile.as(p => icons.powerprofile[p]),
    title: 'Profile Selector',
    content: [Widget.Box({
      vertical: true,
      hexpand: true,
      child: Widget.Box({
        vertical: true,
        children: profiles.map(prof => Widget.Button({
          on_clicked: () => pp.active_profile = prof,
          child: Widget.Box({
            children: [
              Widget.Icon(icons.powerprofile[prof]),
              Widget.Label(pretty(prof)),
            ],
          }),
        })),
      }),
    })],
  })
}

export const ProfileToggle = asusctl.available
  ? AsusProfileToggle
  : PowerProfileToggle

export const ProfileSelector = asusctl.available
  ? AsusProfileSelector
  : PowerProfileSelector
