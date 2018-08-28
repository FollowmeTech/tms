import './vue';
import Vue, { PluginFunction } from 'vue';
import Tms from '@fmfe/tms.js';


export interface VueTmsInstance {
    onList: Array<{ target: Tms; onChage: Function }>;
    app: Vue | null;
    observe(): void;
    destroy(): void;
}

interface VueTmsConstructor {
    install: PluginFunction<Tms>;
    new(): VueTmsInstance;
}

declare const VueTms: VueTmsConstructor;

export default VueTms;