// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  vue: {
      compilerOptions: {
          isCustomElement: tag => tag.includes("center")
      }
  },

  app: {
      head: {
          title: 'Inscryption Save Editor'
      }
  },

  css: [
      "assets/css/main.css"
  ],

  typescript: {
      typeCheck: true,
      strict: true
  },

  telemetry: false,
  compatibilityDate: "2024-10-14"
})