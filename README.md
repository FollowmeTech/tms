## 安装
```bash
   yarn add @fmfe/tms.js
   # or
   npm install @fmfe/tms.js
```

## 例子
- <a href="./examples/vue-tms">Vue 使用例子</a>


## 前言
随着现代软件开发越来越复杂、庞大，软件的运行过程、bug的复现都开始变得越来越难以追踪。Tms的出现，正是为了让软件运行的过程变得透明化、可复现和追踪，甚至我们可以拿到用户的所有行为数据，通过大数据分析，可以反过来对我们的产品进行优化。


## 什么是Tms？
Tms是一种软件的开发思想，它可以应用到任何的编程语言中，在你阅读完本章之后，你会明白Tms是什么，以及它可以做什么，甚至你可以轻易的实现一个属于你自己的Tms。  

简单例子：

```typescript
import Tms from '@fmfe/tms.js';
class Count extends Tms {
    value: number = 0;
    $plus (): this {
        this.value++;
        return this;
    }
    delay (): void {
        setTimeout(() => {
            this.$plus();
        }, 1000);
    }
}

const count = new Count();

count.delay();

count.dep.addSub(({ type }) => {
    console.log(type); // $plus
});
```
在上面的例子中，一秒后，`console.log(type);`会输出一个`$plus`的字符串，Tms会监听子类含有$开头的方法，在其执行完成后，会对外抛出一个事件通知。

## Tms的五种端
```typescript
import Tms from '@fmfe/tms.js';

class List extends Tms {
    // 仓库端
    list: Array<string> = [];
    // 制造端
    get listTotal () {
        return `共有${this.list.length}条记录`;
    }
    // 接收端
    $push (text:string): this {
        this.list.push(text);
        return this;
    }
    // 搬运端
    delay (): void {
        setTimeout(() => {
            this.$push(String(++this.list.length));
        }, 1000);
    }
}

const list = new List();

list.delay();

// 监听端
list.dep.addSub(({ type, payload }) => {
    console.log(type); // $plus
    console.log(payload); // 1
});

```
`仓库端`：顾名思义，就存储货物的地方，把需要的货物在仓库中存储。  
`制造端`：利用仓库的货物，制造对外需要的产品，它可以使用属性访问器、方法来制造。  
`接收端`：所有需要入库的货物，都必须提交给接收端来进行入库，并且在接收端`不可损坏本次入库的货物`。  
`搬运端`：从遥远的地方搬运数据，比如从服务器上，或者是一个定时器，所有异步的操作，都应该在搬运端来实现，然后将货物提交给接收端。  
`监听端`：在接收端完成货物入库时，能知道到本次接收端的所在的`地点、时间、货物`，为了保证监听端可以复制货物，所以在接收端`不可损坏本次入库的货物`。

Tms将程序划分为五种端，不同的端来负责不同的事情，使不同的端职责明确、清晰。Tms可以监听到程序是在`哪个接收端`在`什么时间`接收到了`什么货物`，我们只需要在监听端将接收端的`地点、时间、货物`记录下来，在未来的任何时候，都可以重新走一次这个记录，并且得到的结果也是一致的。

## 常见的问题
#### 1、在接收端损坏本次入库的货物
错误的：
```typescript
import Tms from '@fmfe/tms.js';

interface StudentListItem {
    name: string;
    age: number;
}

class Student extends Tms {
    list: Array<StudentListItem> = [];
    $signIn (item: StudentListItem): this {
        // 错误的写法，损坏了入库的货物 start
        item.age += 10;
        // 错误的写法，损坏了入库的货物 end
        this.list.push(item);
        return this;
    }
}
```
在Tms中，有一个很重要的概念，就是你`不可损坏本次入库的货物`，否则在监听端复制出来的货物会是一个被你损坏过的货物。  

正确的：
```typescript
import Tms from '@fmfe/tms.js';

interface StudentListItem {
    name: string;
    age: number;
}

class Student extends Tms {
    list: Array<StudentListItem> = [];
    $signIn (item: StudentListItem): this {
        this.list.push({
            name: item.name,
            age: item.age + 10
        });
        return this;
    }
}
```
#### 2、如何处理请求
```typescript
import Tms from '@fmfe/tms.js';

export interface Response {
    success: boolean;
    data: Data[];
}

export interface Data {
    id: string;
    authorID: string;
    tab?: Tab;
    content: string;
    title: string;
    lastReplyAt: string;
    good: boolean;
    top: boolean;
    replyCount: number;
    visitCount: number;
    createAt: string;
    author: Author;
}

export interface Author {
    loginname: string;
    avatarURL: string;
}

export enum Tab {
    Ask = 'ask',
    Share = 'share',
}

// 错误的例子
class TopicsError extends Tms {
    data: Data[] = []
    loading: boolean = false;
    $loadStart () {
        this.loading = true;
    }
    $loadSuccess (data: Data[]) {
        this.data = data;
        this.loading = false;
    }
    $loadError () {
        this.loading = false;
    }
    async fetchTopics () {
        this.$loadStart();
        const res: Response = await fetch('https://cnodejs.org/api/v1/topics', {
            'credentials': 'include',
            'headers': {},
            'referrer': 'https://cnodejs.org/api',
            'referrerPolicy': 'unsafe-url',
            'body': null,
            'method': 'GET',
            'mode': 'cors'
        }).then(res => res.json());
        // 这是一种错误的写法，一个异步的请求，
        // 无论成功失败，都应该把数据提交给接收端，
        // 由接收端去处理请求回来的数据
        if (res.success) {
            this.$loadSuccess(res.data);
        } else {
            this.$loadError();
        }
    }
}

const topicsError = new TopicsError();

topicsError.fetchTopics();

topicsError.dep.addSub(({ payload }) => {
    // 这里就无法保证能监听到topicsRight.fetchTopics()方法请求回来的全部数据，
    // 因为请求失败会走$loadError方法
    console.log(payload); 
});

// 正确的例子
class TopicsRight extends Tms {
    data: Data[] = []
    loading: boolean = false;
    $loadStart () {
        this.loading = true;
    }
    $loadDone (res: Response) {
        // 在接收端处理数据
        if (res.success && Array.isArray(res.data)) {
            this.data = res.data;
        }
        this.loading = false;
    }
    async fetchTopics () {
        this.$loadStart();
        const res: Response = await fetch('https://cnodejs.org/api/v1/topics', {
            'credentials': 'include',
            'headers': {},
            'referrer': 'https://cnodejs.org/api',
            'referrerPolicy': 'unsafe-url',
            'body': null,
            'method': 'GET',
            'mode': 'cors'
        }).then(res => res.json());
        // 正确的做法，是将请求回来的完整输入传给接收端，
        // 这样监听端就能监听到请求回来的数据了
        this.$loadDone(res);
    }
}

const topicsRight = new TopicsRight();

topicsRight.fetchTopics();

topicsRight.dep.addSub(({ payload }) => {
    console.log(payload); // 这里就能监听到topicsRight.fetchTopics()方法请求回来的全部数据
});


```
