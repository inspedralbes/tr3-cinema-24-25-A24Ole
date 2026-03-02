import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  vite: {
    plugins: [
      nodePolyfills()
    ]
  },
  alias: {
    '~': './'
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      socketUrl: process.env.SOCKET_URL || 'http://localhost:3000'
    }
  },
  routeRules: {
    '/api/**': { proxy: 'http://backend:8000/api/**' }
  }
})