## 核心概念

这里在一定程度上参考了Vuex的文档，所以在一定程度上Tms合Vuex是十分相似的，不同的是Tms没有Vuex的`Commit => Mutation`的概念，而是只有`Commit`。


### State
```typescript
class Count extends Tms {
    value: number = 0;
    $setValue(value: number) {
        this.value = value;
    }
}

const count = new Count();
count.value; // => 0
```
在Tms中，每一个实例的可枚举属性，都被视为一个状态。你可以随意的读取实例的状态，但是不能随意的更改的实例的状态，否则导致实例的状态无法追踪。
**切记**：所有更新实例状态，都需要通过`Commit`方法来进行更改，这样才能对实例状态变化的过程进行追踪。


`这是一种错误的写法，实例状态的变化，会变得无法追踪。`
```typescript
count.value = 1000;
```
`正确的写法，实例状态的变化，会变得可追踪`
```typescript
count.$setValue(1000);
```


### Getter
```typescript
class Count extends Tms {
    value: number = 0;
    get valueText (): string {
        return `当前的value值是：${this.value}`;
    }
}
```
如果在程序中，有很多地方都需要同样的数据，使用`Getter`可以让我们的程序得到更好的优化。


### Commit

### Action

### Module
