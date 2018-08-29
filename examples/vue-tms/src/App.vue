<template>
    <div id="app">
        <nav class="nav">
            <button class="button" @click="tmsSnapshot.play()">播放快照({{tmsSnapshot.playIndex}}/{{snapshots.length}}) Next Time:{{tmsSnapshot.playNextTime}}ms</button>
            <button class="button" @click="tmsSnapshot.clear()">清空快照</button>
        </nav>
        <router-view/>
        <h2>快照</h2>
        <ul class="snapshots">
            <li v-for="(item, $index) in snapshots" :key="$index">
                <textarea :value="item.state" />
                <div class="button-wrap">
                    <button class="button" @click="tmsSnapshot.recoveryOfIndex($index)">还原</button>
                </div>
            </li>
        </ul>
        <div class="playing" v-show="tmsSnapshot.playing"></div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { tmsSnapshot } from '@/store';

@Component
export default class App extends Vue {
    tmsSnapshot = tmsSnapshot;
    get snapshots () {
        return this.tmsSnapshot.snapshots.sort((a, b) => {
            return b.time - a.time;
        });
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
.playing {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.2);
}
</style>
