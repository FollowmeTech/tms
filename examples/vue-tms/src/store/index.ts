import Vue from 'vue';
import Tms from '@fmfe/tms.js';
import Home from './modules/home';
import VueTms from '@fmfe/vue-tms';

Vue.use(VueTms, Tms);

class Store extends VueTms {
    home: Home = new Home()
}

const store = new Store();
store.run();

export default store;
declare module '@fmfe/vue-tms/types/index' {
    type _StoreInstance = {
        [P in keyof Store]: Store[P]
    };
    interface VueTmsInstance extends _StoreInstance {

    }
  }
