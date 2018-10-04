import Dep from './dep';
import observe from './observe';

const dep: Dep = new Dep();

export default class Tms {
    static dep: Dep = dep;
    static subscribe = dep.addSub;
    static unsubscribe = dep.removeSub;
    dep: Dep = new Dep();
    constructor() {
        observe(this, Tms.prototype, (type: string, ...payloads: Array<any>) => {
            this.dep.notify({
                type,
                payload: payloads[0],
                payloads,
                target: this
            });
            Tms.dep.notify({
                type,
                payload: payloads[0],
                payloads,
                target: this
            });
        });
        Object.defineProperty(this, 'dep', {
            enumerable: false
        });
    }
}
