import Tms from './tms';
export interface TmsDepNotifyParams {
    /**
     * 状态更新的类型
     */
    type: string;
    /**
     * 提交状态更新的参数，如果有多个则取第一个
     */
    payload: any;
    /**
     * 提交状态更新的参数
     */
    payloads: Array<any>;
    /**
     * 状态触发变更的目标
     */
    target: Tms;
}
declare class Dep {
    readonly subs: Array<Function>;
    addSub: (fn: Function) => void;
    removeSub: (fn: Function) => void;
    notify: (params: TmsDepNotifyParams) => void;
    destroy: () => void;
}
export default Dep;
