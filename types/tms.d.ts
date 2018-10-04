import Dep from './dep';
export default class Tms {
    static dep: Dep;
    static subscribe: (fn: Function) => void;
    static unsubscribe: (fn: Function) => void;
    dep: Dep;
    constructor();
}
