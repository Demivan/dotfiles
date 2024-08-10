import * as process from 'node:process'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { defineConfig } from 'vite'

const fullPath = process.argv[5] ?? 'dist/main.js'
const dir = path.dirname(fullPath)
const file = path.basename(fullPath)

export default defineConfig(() => ({
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      formats: ['es'],
      entry: process.argv[4] ?? 'main.ts',
    },
    rollupOptions: {
      output: {
        dir,
        entryFileNames: () => file,
      },
      external: id => id.startsWith('resource://') || id.startsWith('gi://') || id.startsWith('file://'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: fs.readFileSync(path.resolve(process.cwd(), 'style/variables.scss'), 'utf8'),
      },
    },
  },
  resolve: {
    alias: {
      lib: `${process.cwd()}/lib`,
      widget: `${process.cwd()}/widget`,
      service: `${process.cwd()}/service`,
      style: `${process.cwd()}/style`,
      assets: `${process.cwd()}/assets`,
      options: `${process.cwd()}/options.ts`,
    },
  },
}))
