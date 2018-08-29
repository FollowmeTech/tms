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
    constructor (store: S, Tms: Tms) {
        this.store = store;
        this.Tms = Tms;
    }
    /**
     * 添加一条快照
     */
    push (snapshot: Snapshot) {
        this.snapshots.push(snapshot);
    }
    /**
     * 恢复第几个快照
     */
    recoveryOfIndex (index: number) {
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
    }
}
