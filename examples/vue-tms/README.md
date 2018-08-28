# vue-tms

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```


## Tms接入说明
- 安装Tms模块
```bash
   yarn add @fmfe/tms.js
   # or
   npm install @fmfe/tms.js
```
- 创建Tms的实例入口 <a href="./src/store/index.ts">./src/store/index.ts</a>
- 在Vue中安装Tms <a href="src/main.ts">src/main.ts</a>
- 在组件中接入Tms的代码提示 <a href="src/vue-tms.d.ts">src/vue-tms.d.ts</a>
- 在组件中连接和使用Tms <a href="src/views/Home.vue">src/views/Home.vue</a>