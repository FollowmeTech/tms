import './vue';
import Vue, { PluginFunction } from 'vue';
import Tms, { TmsDepNotifyParams } from '@fmfe/tms.js';

export type SubFunc = (event: VueTmsDepNotifyParams) => void;

export interface VueTmsDepNotifyParams extends TmsDepNotifyParams {
    path: string;
    time: number;
}

export interface VueTmsInstance {
    readonly subs: Array<SubFunc>;
    readonly onList: Array<{ target: Tms; onChage: Function }>;
    app: Vue | null;
    run(): void;
    subscribe(fn: SubFunc): void;
    unsubscribe(fn: SubFunc): void;
    destroy(): void;
}

interface VueTmsConstructor {
    install: PluginFunction<Tms>;
    new(): VueTmsInstance;
}

declare const VueTms: VueTmsConstructor;

export default VueTms;