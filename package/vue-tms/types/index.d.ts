import './vue';
import Vue, { PluginFunction } from 'vue';
import Tms, { TmsDepNotifyParams } from '@fmfe/tms.js';

export type SubFunc = (event: VueTmsDepNotifyParams) => void;

export interface VueTmsDepNotifyParams extends TmsDepNotifyParams {
    position: string;
    time: number;
}

export interface VueTmsOptions {
    isDebugLog?: boolean;
}
export interface VueTmsInstance {
    readonly subs: Array<SubFunc>;
    readonly onList: Array<{ target: Tms; onChage: Function }>;
    app: Vue | null;
    run(): this;
    subscribe(fn: SubFunc): this;
    unsubscribe(fn: SubFunc): this;
    destroy(): this;
}

interface VueTmsConstructor {
    install: PluginFunction<Tms>;
    new(options: VueTmsOptions): VueTmsInstance;
}

declare const VueTms: VueTmsConstructor;

export default VueTms;