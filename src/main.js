import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './vuex/store'
import Header from './components/Header/Header.vue'
import Star from './components/Star/Star.vue'
import { Button } from 'mint-ui';

// 引入mock(没有暴露，所以引入的时候无需用from)
import './mock/mockServer'

// 注册全局组件
Vue.component('Header', Header)
Vue.component('Star', Star)
Vue.component(Button.name, Button); //登陆的按钮

/* eslint-disable no-new */
new Vue({
  el: '#app',
  /* components: {
    App
  },
  template: '<App/>' */
  // render: createElement => createElement(App)  // <App/>
  render: h => h(App),  // <App/>
  router, // 配置路由器
  store, // 配置vuex
})
