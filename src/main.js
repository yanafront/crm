import { createApp } from 'vue';
import App from './App.vue';
// Uncomented this line, if needed support PWA
// import './registerServiceWorker';
import router from './router';
import store from './store';
import 'vue-advanced-cropper/dist/style.css';
import sassStyles from '@/assets/style/app.scss';
import { registerComponentsGlobaly, loadPlugins } from '@/helpers';
import screens from './mixins/screens';
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import VueNextSelect from 'vue-next-select';
import 'vue-next-select/dist/index.min.css';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import 'v-calendar/dist/style.css';

export const app = createApp(App);

/**
 * Automatically load Vue plugins
 */
loadPlugins([
    'vue-toastification',
    'maska',
    'vue-ellipse-progress'
]);
/**
 * Automatically import and register components globaly
 */
registerComponentsGlobaly(app);

app.mixin(screens);
app.use(VueClipboard);
app.component('vue-select', VueNextSelect);

app.use(store)
    .use(router)
    .mount('#app')
