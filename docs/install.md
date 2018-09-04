## 安装

```bash
npm install @fmfe/tms.js
```

### 兼容性
由于使用了`Object.defineProperty`，所以它不支持ie9以下版本的浏览器。除此之外，Tms可以运行在任何的javascript运行环境中


### Vue 使用
`注意`：VueTms 无法与`vuex`一起配合使用，因为它们都是在vue的原型链上挂载了`Vue.prototype.$store`对象，会产生冲突。
```bash
npm install @fmfe/vue-tms
```
```typescript
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

const store = new Store()

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
declare module '@fmfe/vue-tms/types/index' {
    type _StoreInstance = {
        [P in keyof Store]: Store[P]
    }
    interface VueTmsInstance extends _StoreInstance { }
}
```

### React 使用
Tms是支持在React中使用的，并且它已经成功的应用在一个React Native的项目中，但是我们现在还没有将它开源出来。

### Node.js 使用
在Node.js中使用，更多的时候是可以追踪bug，复现bug
```javascript
const Tms = require('@fmfe/tms.js');

class Store extends Tms {
    constructor () {
        super();
        this.name = 'Hello world';
    }
    $setName (name) {
        this.name = name;
    }
}

const store = new Store();

store.dep.addSub(({ type, payload }) => {
    console.log(type, payload); // $setName set name
});

store.$setName('set name');

```