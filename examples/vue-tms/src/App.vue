<template>
    <div id="app">
        <nav class="nav">
            <!-- <button class="button">录制状态</button> -->
            <button class="button" @click="saveSnapshot">保存快照</button>
        </nav>
        <router-view/>
        <h2>快照</h2>
        <ul class="snapshots">
            <li v-for="(item, $index) in snapshots" :key="$index">
                <textarea :value="item" />
                <div class="button-wrap">
                    <button class="button" @click="restoreSnapshot(item)">还原</button>
                    <button class="button" @click="restoreSnapshotRemove($index)">删除</button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import Tms from '@fmfe/tms.js';

@Component
export default class App extends Vue {
    snapshots: Array<string> = [];
    saveSnapshot () {
        this.snapshots.push(JSON.stringify(this.$store));
    }
    restoreSnapshotRemove (index: number) {
        this.snapshots.splice(index, index + 1);
    }
    restoreSnapshot (stateText: string) {
        restoreSnapshot(this.$store, stateText);
        function restoreSnapshot (store: any, stateText: string) {
            const state = JSON.parse(stateText);
            const _restoreSnapshot = (store: any, state: any) => {
                Object.keys(state).forEach(k => {
                    const currentState: any = state[k];
                    if (store[k] instanceof Tms) {
                        _restoreSnapshot(store[k], currentState);
                    } else {
                        store[k] = currentState;
                    }
                });
            };
            _restoreSnapshot(store, state);
        }
    }
}
</script>

<style lang="less" scoped>
#app {
  width: 480px;
  margin: 0 auto;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.nav {
    margin-bottom: 10px;
    .button {
        & + .button {
            margin-left: 10px;
        }
    }
}
.snapshots {
    padding: 0;
    margin: 0;
    li {
        display: flex;
        margin-bottom: 10px;
        list-style: none;
    }
    textarea {
        flex: 1;
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #ddd;
        resize: none;
        outline: none;
    }
    .button-wrap {
        display: flex;
        flex: 0;
        justify-content: center;
        align-items: center;
    }
    .button {
        width: 80px;
        height: 30px;
        margin: 0 10px;
    }
}
</style>
