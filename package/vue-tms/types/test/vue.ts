import Vue from 'vue';
import Tms from '@fmfe/tms.js';
import VueTms from '../index';

Vue
    .use(VueTms, Tms);

class Store extends VueTms {

}
const store = new Store();

const vm = new Vue({
    store
});
vm.$store;
store.subscribe((event) => {
    event.payload;
    event.payloads;
    event.target;
    event.type;
});

store.unsubscribe(() => {

});

