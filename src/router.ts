import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/pages/home';
import Logs from './components/pages/logs';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/network',
      name: 'new-network',
      component: () =>
        import(
          /* webpackChunkName: "new-network" */ './components/pages/new-network'
        ),
    },
    {
      path: '/network/:id',
      name: 'network-view',
      component: () =>
        import(
          /* webpackChunkName: "network-view" */ './components/pages/network-view'
        ),
    },
    {
      path: '/logs/:name',
      name: 'logs',
      component: Logs,
    },
  ],
});
