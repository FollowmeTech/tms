<template>
  <div class="home">
    <div class="input">
      <input
        placeholder="请输入内容，按回车键添加"
        v-model="value" @keyup.enter="indexInput.$addItem()"
      />
    </div>
    <ul class="list">
      <li v-for="(text, $index) in indexInput.list" :key="$index">
        <div class="text">{{text}}</div>
        <button class="btn" @click="indexInput.$deleteItem($index)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  get indexInput () {
    return this.$store.home.indexInput
  }
  get value (): string {
    return this.indexInput.value
  }
  set value (text: string) {
    this.indexInput.$value(text)
  }
}
</script>
<style scoped>
  .input {
      border: 1px solid #ddd;
  }
  .input input {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    margin: 0;
    line-height: 28px;
    outline: none;
    border: none;
  }
  .list {
    padding: 0;
    margin: 30px 0 0 0;
  }
  .list li {
    display: flex;
    padding: 10px;
    list-style: none;
    border: 1px solid #ddd;
    border-top: none;
  }
  .list li:first-of-type {
    border-top: 1px solid #ddd;
  }
  .list li .text {
    flex-grow: 1;
    flex-shrink: 1;
    text-align: left;
  }
  .list li .btn {
    flex-grow: 0;
    flex-shrink: 0;
  }
</style>
