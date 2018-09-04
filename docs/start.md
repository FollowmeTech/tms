## 开始

**注意**：在后面的所有例子，我们都会以`Typescript`来编写，所以需要你具备一点基础的`Typescript`知识。

### 一个简单的例子
```typescript

class Count extends Tms {
    value: number = 0;
    $plus() {
        this.value++;
    }
}

const count = new Count();

```

通过Tms提供的Dep对象，监听每一个`Commit`方法执行完成
```typescript

count.dep.addSub((event) => {
    console.log(event);
    /** 输出：
        {
            type: '$plus',
            payload: undefined,
            payloads: [],
            target: Count { value: 1 }
        }
     */
});
```
执行一个`Commit`方法，更新实例状态
```typescript
count.$plus();
```
输出实例状态
```
console.log(count.value) // => 1
```

**注意**：`Tms的Commit方法`和`Vuex的Mutation方法`以及`Redux的Reducer方法`是类似的，所有更新实例的状态都必须通过`Commit`，这样才能实现对实例的历史状态进行追踪。