import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import typescript from '@rollup/plugin-typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'rally-card',
        // the proper extensions will be added
        fileName: 'rally-card',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['React', 'react', 'react-dom'],
        plugins: [
          typescript({
            'target': 'es2020',
            'rootDir': resolvePath('../src'),
            'declaration': true,
            'declarationDir': resolvePath('../dist'),
            exclude: resolvePath('../node_modules/**'),
            allowSyntheticDefaultImports: true
          })
        ]
      }
  },
})
