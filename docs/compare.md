## 比较Vuex、Redux
假设实现一个计数功能  

### `Vuex`
```typescript

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
### `Redux`
```typescript

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
### `Tms`
```typescript
class Store extends Tms {
    count: number = 0;
    $increment() {
        this.count++;
    }
}

const store = new Store();

store.$increment();

console.log(store.count); // -> 1
```
通过上述，Tms是基于class面向对象的方式进行开发的，它通过`$`这个特殊的标记来标记为`Commit`方法。

同时，Tms是一种没有入侵的开发模式，你只需要把` extends Tms`继承Tms的代码删除掉，它依然能够正常的运行。