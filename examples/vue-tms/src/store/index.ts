import Vue from 'vue'
import Tms from '@fmfe/tms.js'
import Home from './modules/home'
import VueTms from './vue-tms'

Vue.use(VueTms, Tms)

class Store extends VueTms {
    home: Home = new Home()
}

const store = new Store()
store.observe()
export default store
console.log(JSON.parse(JSON.stringify(store)), store)
declare module 'vue/types/vue' {
    interface Vue {
      $store: Store;
    }
  }
