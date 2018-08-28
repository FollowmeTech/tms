import Vue, { VueConstructor } from 'vue'
import Tms, { TmsDepNotifyParams, TmsConstructor } from '@fmfe/tms.js'

const getType = (payload: any): string => {
  return Object.prototype.toString.call(payload).replace(/^(.*?) |]$/g, '').toLowerCase()
}

export default class VueTms {
  private static _Vue: VueConstructor;
  private static _Tms: TmsConstructor;
  static install (_Vue: VueConstructor, _Tms: TmsConstructor) {
    VueTms._Vue = _Vue
    VueTms._Tms = _Tms
    Object.defineProperty(Vue.prototype, '$store', {
      get () {
        return this.$root._store
      }
    })
    Object.defineProperty(Vue.prototype, '_store', {
      get () {
        return this.$options.store
      }
    })
  }
  private _vm: Vue | null;
  constructor () {
    if (!VueTms._Vue || !VueTms._Tms) {
      throw new Error(`Please install with Vue.use(VueTms, Tms).`)
    }
    this._vm = null
  }
  private readonly _onList: Array<{ target: Tms; onChage: Function }> = [];
  observe (): void {
    const store: any = this
    Object.defineProperty(this, '_vm', {
      enumerable: false
    })
    Object.defineProperty(this, '_onList', {
      enumerable: false
    })
    this._vm = new VueTms._Vue({
      data: this
    })
    const observeTms = (opts: any, paths: Array<string>) => {
      Object.keys(opts).forEach(k => {
        const item: Tms = opts[k]
        if (item instanceof VueTms._Tms && process.env.NODE_ENV !== 'production') {
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
            )
          }
          item.dep.addSub(onChage)
          this._onList.push({
            target: item,
            onChage
          })
          observeTms(item, [...paths, k])
        }
      })
    }
    observeTms(this, [])
  }
  destroy () {
    if (this._vm) {
      this._vm.$destroy()
      this._onList.forEach(item => {
        item.target.dep.removeSub(item.onChage)
      })
      this._onList.splice(0, this._onList.length)
    }
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: VueTms;
  }
}
