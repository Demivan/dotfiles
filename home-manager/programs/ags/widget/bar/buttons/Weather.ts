import Weather from 'service/weather'
import { clock } from 'lib/variables'
import PanelButton from '../PanelButton'

import '../../../style/widgets/weather.css'

const iconMap = {
  '01d': {
    day: '\uE30D',
    night: '\uE32B',
  },
  '02d': {
    day: '\uE302',
    night: '\uE32E',
  },
  '03d': {
    day: '\uE33D',
    night: '\uE33D',
  },
  '04d': {
    day: '\uE312',
    night: '\uE312',
  },
  '09d': {
    day: '\uE309',
    night: '\uE334',
  },
  '10d': {
    day: '\uE308',
    night: '\uE333',
  },
  '11d': {
    day: '\uE30F',
    night: '\uE338',
  },
  '13d': {
    day: '\uE30A',
    night: '\uE335',
  },
  '50d': {
    day: '\uE303',
    night: '\uE346',
  },
}

export default () => PanelButton({
  window: 'datemenu',
  child: Widget.Box({
    class_name: 'weather',
    tooltipText: Weather.bind('forecasts').as(f => f?.[0]?.list[0]?.weather[0].description),
    children: [
      Widget.Label({
        label: Weather.bind('forecasts').as(f => {
          const temp = f?.[0]?.list[0].main.temp
          if (!temp)
            return ''

          return `${temp.toFixed(1)}°C`
        }),
      }),
      Widget.Label({
        class_name: 'icon',
        label: Utils.merge([Weather.bind('forecasts'), clock.bind()], (f, c) => {
          const icons = iconMap[f?.[0]?.list[0]?.weather[0].icon]
          if (!icons)
            return ''

          const icon = c.to_local()!.get_hour() % 12 < 6
            ? icons.day
            : icons.night

          return icon
        }),
      }),
    ],
  }),
})
