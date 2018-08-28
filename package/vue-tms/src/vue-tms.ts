import { VueTmsInstance, VueTmsDepNotifyParams } from '../types/index';
import Vue, { VueConstructor } from 'vue';
import Tms, { TmsDepNotifyParams, TmsConstructor } from '@fmfe/tms.js';

const getType = (payload: any): string => {
    return Object.prototype.toString.call(payload).replace(/^(.*?) |]$/g, '').toLowerCase();
};

type SubFunc = (event: VueTmsDepNotifyParams) => void;

export default class VueTms implements VueTmsInstance {
  static _Vue: VueConstructor | undefined;
  static _Tms: TmsConstructor | undefined;
  readonly onList: Array<{ target: Tms; onChage: Function }> = []
  readonly subs: Array<SubFunc> = [];
  app: Vue | null;
  constructor() {
      if (!VueTms._Vue || !VueTms._Tms) {
          throw new Error(`Please install with Vue.use(VueTms, Tms).`);
      }
      this.app = null;
  }
  static install(_Vue: VueConstructor, _Tms: TmsConstructor): void {
      VueTms._Vue = _Vue;
      VueTms._Tms = _Tms;
      Object.defineProperty(VueTms._Vue.prototype, '$store', {
          get() {
              return (this as any).$root._store;
          }
      });
      Object.defineProperty(VueTms._Vue.prototype, '_store', {
          get() {
              return (this as any).$options.store;
          }
      });
  }
  run(): this {
      Object.defineProperty(this, 'app', {
          enumerable: false
      });
      Object.defineProperty(this, 'onList', {
          enumerable: false
      });
      if (!VueTms._Vue) return this;
      this.app = new VueTms._Vue({
          data: this
      });
      const observeTms = (opts: any, paths: Array<string>) => {
          Object.keys(opts).forEach(k => {
              const item: Tms = opts[k];
              if (VueTms._Tms && item instanceof VueTms._Tms) {
                  const onChage = (event: TmsDepNotifyParams) => {
                      const path = `${paths.concat([k]).join('/')}.${event.type}`;
                      if (process.env.NODE_ENV !== 'production') {
                          console.log(
                              `type       ${path}(payload: ${getType(event.payload)});`,
                              `\n\rpayload   `,
                              event.payload,
                              `\n\rpayloads  `,
                              event.payloads,
                              `\n\rtarget    `,
                              event.target,
                              `\n\r---`
                          );
                      }
                      this.subs.forEach(fn => fn({
                          ...event,
                          path,
                          time: Date.now()
                      }));
                  };
                  item.dep.addSub(onChage);
                  this.onList.push({
                      target: item,
                      onChage
                  });
                  observeTms(item, [...paths, k]);
              }
          });
      };
      observeTms(this, []);
      return this;
  }
  subscribe(fn: SubFunc): this {
      this.subs.push(fn);
      return this;
  }
  unsubscribe(fn: SubFunc): this {
      const index = this.subs.indexOf(fn);
      this.subs.splice(index, 1);
      return this;
  }
  destroy(): this {
      if (this.app) {
          this.app.$destroy();
          this.onList.forEach(item => {
              item.target.dep.removeSub(item.onChage);
          });
      }
      this.onList.splice(0, this.onList.length);
      this.subs.splice(0, this.subs.length);
      return this;
  }
}
