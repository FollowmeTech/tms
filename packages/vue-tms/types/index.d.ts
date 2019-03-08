import { VueConstructor } from "vue";
import Tms, { TmsDepNotifyParams } from "@fmfe/tms.js";
export interface VueTmsDepNotifyParams extends TmsDepNotifyParams {
    position: string;
    time: number;
}
declare type SubFunc = (event: VueTmsDepNotifyParams) => void;
export interface VueTmsOptions {
    isDebugLog?: boolean;
}
export default class VueTms extends Tms {
    static _Vue: VueConstructor | undefined;
    static install(_Vue: VueConstructor, _Tms: Tms): void;
    readonly onList: Array<{
        target: Tms;
        onChage: Function;
    }>;
    readonly subs: Array<SubFunc>;
    private _run;
    options: VueTmsOptions;
    constructor(options?: VueTmsOptions);
    run(): this;
    observeTms(target: typeof Tms, paths: string[]): void;
    subscribe(fn: SubFunc): this;
    unsubscribe(fn: SubFunc): this;
    destroy(): this;
}
export {};
