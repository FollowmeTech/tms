import { TmsDepInstance, TmsDepNotifyParams } from '../typings/index';

class Dep implements TmsDepInstance {
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
