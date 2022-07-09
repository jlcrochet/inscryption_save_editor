import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    vue: {
        compilerOptions: {
            isCustomElement: tag => tag.includes("center")
        }
    },

    meta: {
        title: "Inscryption Save Editor"
    },

    css: [
        "assets/css/main.css"
    ],

    telemetry: false
})
