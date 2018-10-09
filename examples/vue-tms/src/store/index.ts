import Vue from 'vue';
import Tms from '@fmfe/tms.js';
import Home from './modules/home';
import VueTms from '@fmfe/vue-tms';
import TmsSnapshot from './tms-snapshot';

Vue.use(VueTms, Tms);

class Store extends VueTms {
    home: Home = new Home()
}

const store = new Store({
    isDebugLog: true
});
export const tmsSnapshot = new TmsSnapshot(store, Tms);
store
    .run()
    .subscribe((event) => {
        tmsSnapshot.push({
            state: JSON.stringify(store),
            time: event.time,
            position: event.position,
            payloads: JSON.stringify(event.payloads)
        });
    });

export default store;

declare module 'vue/types/vue' {
    interface Vue {
        $store: Store;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        store?: Store;
    }
}
