import { Component, Vue } from 'vue-property-decorator'
import App from './App.vue'
import router from './router'
/**
 * 引入Tms的模块
 */
import store from '@/store/index'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
})
  .$mount('#app')
