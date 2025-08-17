import './assets/main.css'

import { createApp } from 'vue'
import router from './router'
import PrimeVue from "primevue/config"
import Aura from '@primevue/themes/aura'
import { ToastService } from 'primevue'
import 'primeicons/primeicons.css'
import App from './App.vue'
import { useUserStore } from './stores/user'
import { createPinia } from 'pinia'

const app = createApp(App);
const pinia = createPinia()
app.use(pinia)
app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});
app.mount('#app')

const userStore = useUserStore()
userStore.fetchUser()
