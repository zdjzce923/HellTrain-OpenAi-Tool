import { defineConfig, loadEnv, type PluginOption } from 'vite'
import mock from 'vite-plugin-mockit'
import htmlTemplate from 'vite-plugin-html-template'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ command, mode }) => {
  // 处理NODE_ENV
  if (command === 'build')
    process.env.VITE_USER_NODE_ENV = process.env.NODE_ENV = 'production'

  const envPrefix = 'VUE_APP_'
  const env = loadEnv(mode, '', envPrefix) as ImportMetaEnv
  env.VUE_APP_MODE = process.env.VUE_APP_MODE = mode

  const plugins: (PluginOption | PluginOption[])[] = [
    tsconfigPaths(),
    checker({ typescript: true }),
    htmlTemplate({
      data: env,
    }),
    legacy({ modernPolyfills: true }),
    mode === 'development' ? mock() : undefined,
  ]
  return {
    envPrefix,
    base: env.VUE_APP_BASE_URL,
    plugins,
    css: {
      preprocessorOptions: {
      },
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: '[local]--[hash:base64:5]',
      },
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          target: '',
          changeOrigin: true,
        }
      },
    },
  }
})
