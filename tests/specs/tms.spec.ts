import Tms from '../../src/tms';

it('base', () => {
    class Test extends Tms {
        count: number = 0;
        $pulsCount() {
            this.count++;
        }
        $reduceCount() {
            this.count--;
        }
        $setCount(count) {
            this.count = count;
        }
    }
    const store = new Test();
    const args = [];
    let ufd;
    Tms.subscribe((arg) => {
        args.push(arg);
    });

    store.$pulsCount();
    expect(store.count).toBe(1);

    store.$reduceCount();
    expect(store.count).toBe(0);

    store.$setCount(100);
    expect(store.count).toBe(100);


    expect(args).toEqual([
        {
            type: '$pulsCount',
            payload: ufd,
            payloads: [],
            target: store
        },
        {
            type: '$reduceCount',
            payload: ufd,
            payloads: [],
            target: store
        },
        {
            type: '$setCount',
            payload: 100,
            payloads: [100],
            target: store
        }
    ]);
});