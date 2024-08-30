import type { Opt } from 'lib/option'
import options from 'options'

const deps = [
  'font',
  'theme',
  'bar.flatButtons',
  'bar.position',
  'bar.battery.charging',
  'bar.battery.blocks',
]

async function resetCss() {
  try {
    App.applyCss(`${App.configDir}/style.css`, true)
  }
  catch (error) {
    error instanceof Error
      ? logError(error)
      : console.error(error)
  }
}

Utils.monitorFile(`${App.configDir}/style.css`, resetCss)
options.handler(deps, resetCss)
await resetCss()
