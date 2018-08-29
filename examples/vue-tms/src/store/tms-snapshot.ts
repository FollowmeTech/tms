import Tms from '@fmfe/tms.js';

interface Snapshot {
    state: string;
    time: number;
    position: string;
    payloads: string;
}

export default class TmsSnapshot<S = {}> {
    store: S;
    Tms: any;
    snapshots: Array<Snapshot> = [];
    playIndex: number = 0;
    playing: boolean = false;
    playNextTime: number = 0;
    constructor (store: S, Tms: Tms) {
        this.store = store;
        this.Tms = Tms;
    }
    /**
     * 添加一条快照
     */
    push (snapshot: Snapshot): this {
        this.snapshots.push(snapshot);
        return this;
    }
    /**
     * 恢复第几个快照
     */
    recoveryOfIndex (index: number): this {
        const stateText = this.snapshots[index].state;
        const restoreSnapshot = (store: any, stateText: string): void => {
            const state = typeof stateText === 'string' ? JSON.parse(stateText) : stateText;
            const _restoreSnapshot = (store: any, state: any) => {
                Object.keys(state).forEach(k => {
                    const currentState: any = state[k];
                    if ((store[k] as any) instanceof this.Tms) {
                        _restoreSnapshot(store[k], currentState);
                    } else {
                        store[k] = currentState;
                    }
                });
            };
            _restoreSnapshot(store, state);
        };
        restoreSnapshot(this.store, stateText);
        return this;
    }
    /**
     * 播放快照
     */
    play (): this {
        const playIndex = this.playIndex;
        const recoveryIndex = this.snapshots.length - playIndex -1;
        // 执行下一个快照
        if (this.snapshots.length - 1 > playIndex) {
            this.playNextTime = this.snapshots[recoveryIndex - 1].time - this.snapshots[recoveryIndex].time;
            setTimeout(() => {
                this.play();
            }, this.playNextTime, playIndex);
        }
        // 渲染当前的快照
        if (this.snapshots.length > playIndex) {
            this.recoveryOfIndex(recoveryIndex);
        }
        // 更新快照索引
        if (this.snapshots.length - 1 > playIndex) {
            this.playIndex++;
            this.playing = true;
        } else {
            this.playIndex = 0;
            this.playNextTime = 0;
            this.playing = false;
        }
        return this;
    }
    clear () {
        this.snapshots.splice(0, this.snapshots.length);
    }
}
