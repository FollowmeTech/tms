import { VueTmsInstance } from '../types/index';
import Vue, { VueConstructor } from 'vue';
import Tms, { TmsDepNotifyParams, TmsConstructor } from '@fmfe/tms.js';

const getType = (payload: any): string => {
    return Object.prototype.toString.call(payload).replace(/^(.*?) |]$/g, '').toLowerCase();
};

export default class VueTms implements VueTmsInstance {
  static _Vue: VueConstructor | undefined;
  static _Tms: TmsConstructor | undefined;
  onList: Array<{ target: Tms; onChage: Function }> = []
  app: Vue | null;
  constructor() {
      if (!VueTms._Vue || !VueTms._Tms) {
          throw new Error(`Please install with Vue.use(VueTms, Tms).`);
      }
      this.app = null;
  }
  static install(_Vue: VueConstructor, _Tms: TmsConstructor) {
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
  observe(): void {
      Object.defineProperty(this, 'app', {
          enumerable: false
      });
      Object.defineProperty(this, 'onList', {
          enumerable: false
      });
      if (!VueTms._Vue) return;
      this.app = new VueTms._Vue({
          data: this
      });
      const observeTms = (opts: any, paths: Array<string>) => {
          Object.keys(opts).forEach(k => {
              const item: Tms = opts[k];
              if (VueTms._Tms && item instanceof VueTms._Tms && process.env.NODE_ENV !== 'production') {
                  const onChage = (event: TmsDepNotifyParams) => {
                      console.log(
                          `type       ${paths.concat([k]).join('/')}.${event.type}(payload: ${getType(event.payload)});`,
                          `\n\rpayload   `,
                          event.payload,
                          `\n\rpayloads   `,
                          event.payloads,
                          `\n\rtarget    `,
                          event.target,
                          `\n\r---`
                      );
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
  }
  destroy() {
      if (this.app) {
          this.app.$destroy();
          this.onList.forEach(item => {
              item.target.dep.removeSub(item.onChage);
          });
          this.onList.splice(0, this.onList.length);
      }
  }
}
