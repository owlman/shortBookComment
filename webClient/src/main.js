import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vueCookies from 'vue-cookies';
// 引入 store 模块
import store from './store';

Vue.use(vueCookies);
Vue.config.productionTip = false;

new Vue({
    router,
    store, // 注册 store 模块
    render: h => h(App)
}).$mount('#app');
