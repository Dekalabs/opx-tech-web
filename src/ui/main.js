import { createApp } from 'vue'

/* Plugins --------------------------------------------------------- */
import { router } from '@/ui/plugins/vue-router'
import { i18n } from '@/ui/plugins/vue-i18n'

/* Styles ---------------------------------------------------------- */
import './styles/index.css'

/* Main App ------------------------------------------------------- */
import App from './App.vue'

createApp(App).use(i18n).use(router).mount('#app')
