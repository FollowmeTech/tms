## 什么是Tms？


### 名称的来源
Tms来源于一个起初是叫`trade master`的React Native项目，Tms首次以`store`的形式在此应用上获得了实践。


### 它是什么？
Tms是一种程序的设计模式，它使程序的运行的状态变得透明化、场景可复现、历史可追踪，它能将程序运行的过程保存起来数据保存起来，这在大数据时代，往往是一家公司的核心竞争力之一。

### 实现一个简单版本的Tms
```typescript
class Tms {
    constructor() {
        // 获取当前实例的原型链上德所有方法
        const prototype = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(prototype).forEach(type => {
            // 获取当前属性的相关描述
            const descriptor = Object.getOwnPropertyDescriptor(prototype, type);
            if (
                typeof descriptor !== 'undefined' &&
                /^\$/.test(type) && typeof descriptor.value === 'function'
            ) {
                // 监听
                Object.defineProperty(this, type, {
                    ...descriptor,
                    value(...args: any[]) {
                        const res = descriptor.value.apply(this, args);
                        console.log({
                            type: type,
                            payload: args[0],
                            payloads: args,
                            target: this
                        });
                        return res;
                    }
                });
            }
        });
    }
}

class User extends Tms {
    uid = 0;
    $login(uid: number): this {
        this.uid = uid;
        return this;
    }
}


const user = new User();

user.$login(100);

/** 输出
    {
        type: '$login',
        payload: 100,
        payloads: [100],
        target: User { uid: 100 }
    }
 */
```
在Tms中，因为需要知道哪些方法需要监听，哪些方法不需要监听，所以在`javascript`版本的Tms中会监听当前实例原型上包含所有$开头的方法。  

**注意**：为了保证程序的可复现性，所以所有$开头的方法，都必须是一个同步的方法，并且你如果需要更新实例的状态，都必须在$开头的方法去更新状态。在接下来的文章中，所有$开头的方法，我们都统一称之为`Commit`方法。

**核心**： 每一个状态的更新，都源于一次同步的`Commit`方法的提交。
