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

😊 `正确的写法，实例状态的变化，会变得可追踪`
```typescript
count.$setValue(1000);
```
😢 `这是一种错误的写法，实例状态的变化，会变得无法追踪。`
```typescript
count.value = 1000;
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
- 1、更新实例的状态，必须在`Commit`方法中修改，所有以$开头为标志的方法，都会被认为是`Commit`方法。  

    😊 `正确的：例子`
    ```typescript
    class Count extends Tms {
        value: number = 0;
        $plus() {
            this.value++;
        }
    }
    ```
    😢 `错误的：例子`
    ```typescript
    class Count extends Tms {
        value: number = 0;
        plus() {
            this.value++;
        }
    }
    ```

- 2、不能修改传入的载荷，只能赋值或复制一份对象。

    😊 `正确的：只赋值的例子`
    ```typescript
    class List extends Tms {
        data: string[] = [];
        $loadDone(data: string[]) {
            this.data = data;
        }
    }
    ```
    😢 `错误的：修改了传入载荷的例子`
    ```typescript
    class List extends Tms {
        data: string[] = [];
        $loadDone(data: string[]) {
            data.push('text');
            this.data = data;
        }
    }
    ```
    😢 `正确的：复制一份对象，不对传入的载荷进行更改`
    ```typescript
    class List extends Tms {
        data: string[] = [];
        $loadDone(data: string[]) {
            this.data = [
                ...data,
                'text'
            ];
        }
    }
    ```
- 3、`Commit`必须是一个同步的方法，不能编写异步的代码、或者异步的更新状态。

    😊 `正确的：同步的更新状态`
    ```typescript
    class Count extends Tms {
        value: number = 0;
        $plus() {
            this.value++;
        }
    }
    ```
    😢 `错误的：在Commit中异步的更新状态`
    ```typescript
    class Count extends Tms {
        value: number = 0;
        $plus() {
            setTimeout(() => {
                this.value++;
            }, 100);
        }
    }
    ```
    在`Commit`异步的更新实例状态，将会导致状态变化的过程无法追踪，请将异步放到`Action`中。  

    😊 `正确的：在Action中异步的更新状态`
    ```typescript
    class Count extends Tms {
        value: number = 0;
        $plus() {
            this.value++;
        }
        plus() {
            setTimeout(() => {
                this.$plus();
            }, 100);   
        }
    }
    ```

### Action
Action专门负责所有的异步操作、比如定时器、HTTP请求等，它不负责更新状态，它将请求的结果提交给`Commit`方法。

😊 `正确的：一个HTTP请求查询的例子`
```typescript
interface Response {
    code: number;
    data: string [];
}

class Api {
    getList(): Promise<Response> {
        return new Promise((resolve) => {
            resolve({
                code: 0,
                data: ['1', '2']
            });
        });
    }
}

class List extends Tms {
    api: Api;
    loading: boolean = false
    data: string[] = [];
    constructor(api: Api) {
        super();
        this.api = api;
    }
    $loadStart() {
        this.loading = true;
    }
    $loadDone(response: Response) {
        if (response.code === 0) {
            this.data = response.data;
        }
        this.loading = false;
    }
    async getList() {
        this.$loadStart();
        this.$loadDone(await this.api.getList());
    }
}

const list = new List(new Api());

list.getList();
```
你应该将`this.api.getList()`请求回来的完整数据，传入`Commit`方法中，这样就能追踪到这个请求的结果。在`Commit`方法中去对请求的结果进行处理。

同理，为了能够对所有的请求结果进行监听，所有的请求结果，都应该存储在实例上，通过`Commit`更新实例的请求结果。


### Module
随着应用程序越来越大，我们需要对程序进行拆分成一个一个小的模块。
```typescript

class Store extends Tms {
    list: List = new List(new Api());
    count: Count = new Count();
}

const store = new Store();

store.list.getList();
```
