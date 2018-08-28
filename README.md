## 安装
```bash
   yarn add @fmfe/tms.js
   # or
   npm install @fmfe/tms.js
```

## 例子
- <a href="./examples/vue-tms">Vue 使用例子</a>


## 前言
其实我不太喜欢将TMS称之为一种状态管理模式，我更喜欢将它称之为一种开发模式。为了满足业务的需要，同时使用了`Vue`、`React`的相关技术栈，而且未来也会开发`微信小程序`、`快应用`，不同框架、不同平台之间的代码复用，以及降低它们的学习成本是TMS出现的根本原因。现在前端主流的开发方式，都是将业务写在业务组件之中，在需求快速变更的情况下，业务的变化导致组件的拆分，这种开发方式就稍显笨拙了。

## 对比
实现一个计数功能  

`vuex`
```javascript

    import Vuex from 'vuex';

    const store = new Vuex.Store({
        state: {
            count: 0
        },
        mutations: {
            increment(state) {
                state.count++;
            }
        }
    });

    store.commit('increment');

    console.log(store.state.count); // -> 1

```
`redux`
```javascript

    import { createStore } from 'redux';


    const reducer = (state = { count: 0 }, action) => {
        switch (action.type) {
            case 'increment': return { count: state.count + 1 };
            default: return state;
        }
    };


    const store = createStore(reducer);

    store.dispatch({ type: 'increment' });

    console.log(store.getState().count); // -> 1

```
`TMS`
```javascript
    import Tms from 'tms.js';

    class Store extends Tms {
        count = 0;
        $increment() {
            this.count++;
        }
    }

    const store = new Store();

    store.$increment();

    console.log(store.count); // -> 1
```
通过上述对比，我们知道TMS是一个以class形式的开发模式，你只需要把`extends Tms`的相关代码删除掉，它仍然能够很好的运行，所以说TMS本身是没有入侵性的，它能很好的运行在JavaScript的各种运行环境中。

## 工作原理
在实例初始化的时候，TMS会查找原型链上所有`$开头的方法`，然后劫持当前的实例对应的`$开头的方法`
例子：
```javascript

    class Store extends Tms {
        count = 0;
        constructor() {
            super();
            // 错误的，原型链上不会存在$reduce方法
            this.$reduce = () => {
                this.count--;
            };
        }
        // 错误的，原型链上不会存在$plus方法
        $plus = () => {
            this.count++;
        }
        // 正确的，原型链上会存在$setCount方法
        $setCount(count) {
            this.count = count;
        }
    }

```
