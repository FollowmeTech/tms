import Tms from '../src/tms';

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
    target: TmsInstance;
}
export interface TmsInstance {
    /**
     * 事件订阅
     */
    dep: TmsDepInstance;
    [x: string]: any;
}
export interface TmsConstructor {
    new(): this;
}

export interface TmsDepInstance {
    readonly subs: Array<Function>;
    /**
     * 添加事件订阅
     */
    addSub: (fn: (params: TmsDepNotifyParams) => void) => void;
    /**
     * 删除事件订阅
     */
    removeSub: (fn: Function) => void;
    /**
     * 通知事件触发
     */
    notify: (params: TmsDepNotifyParams) => void;
    /**
     * 销毁所有的事件订阅
     */
    destroy: () => void;
}

export default Tms;
