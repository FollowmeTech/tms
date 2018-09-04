## 常见的用法

### vue中的`v-model`指令使用

创建`Search`类
```typescript
class Search extends Tms {
    value: string = '';
    $value(value: string) {
        this.value = value;
    }
}
```
Vue中使用
```html
<template>
    <div>
        <input
            type="text"
            placeholder="请输入内容"
            v-model="value"
        />
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Home extends Vue {
        // ...
        get search () {
            return this.$store.search;
        }
        get value (): string {
            return this.search.value;
        }
        set value (text: string) {
            this.search.$value(text);
        }
    }
</script>
```