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
class Dep {
    readonly subs: Array<Function> = [];
    addSub = (fn: Function) => {
        this.subs.push(fn);
    }
    removeSub = (fn: Function) => {
        const index = this.subs.indexOf(fn);
        this.subs.splice(index, 1);
    }
    notify = (params: TmsDepNotifyParams) => {
        this.subs.forEach(fn => fn(params));
    }
    destroy = () => {
        this.subs.splice(0, this.subs.length);
    }
}

export default Dep;
