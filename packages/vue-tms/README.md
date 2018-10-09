## 安装
```bash
   yarn add @fmfe/tms.js @fmfe/vue-tms
   # or
   npm install @fmfe/tms.js @fmfe/vue-tms
```

## 使用
```javascript
import Vue from 'vue'
import Tms from '@fmfe/tms.js'
import VueTms from '@fmfe/vue-tms'

Vue.use(VueTms, Tms)

class Count extends Tms {
    count: number = 0
    $increment() {
        this.count++
    }
}

class Store extends VueTms {
    count: Count = new Count()
}

const store = new Store({
    // 是否显示 Commit log
    isDebugLog: process.env.NODE_ENV !== 'production'
})

// 运行程序
store.run()

// 订阅状态变化
const onChage = (event) => {
    console.log(event)
}
store.subscribe(onChage)

// 取消状态变化订阅
// store.unsubscribe(onChage)

// 销毁实例
// store.destroy()

// 在程序总安装vue tms
const app = new Vue({
    // ...
    store,
    created() {
        this.$store.count.$increment()
    }
})

// Typescript 添加类型，在组件中可以获得代码提示
declare module 'vue/types/vue' {
    interface Vue {
        $store: Store;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        store?: Store;
    }
}

```