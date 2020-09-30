import '@/components/bootstrap-ant-design';
import Vue from 'vue';
import App from './components/app';
import './filters';
import router from './router';
import { store } from './store';
import VueClipboard from 'vue-clipboard2';

Vue.config.productionTip = false;

// Register plugins
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
