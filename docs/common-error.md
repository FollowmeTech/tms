## 常见的错误

### `Commit`方法没有被监听到
```typescript
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
Tms会查找原型链上的方法，对当前实例的方法进行劫持。所以为了Tms能够正常的监听到，必须保证`Commit`方法在原型链上存在