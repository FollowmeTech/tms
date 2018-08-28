import Vue from 'vue';
import { VueTmsInstance } from './index'

declare module 'vue/types/vue' {
    interface Vue {
        $store: VueTmsInstance;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        store?: VueTmsInstance;
    }
}
