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

it('getPrototypes', () => {
    class Count1 extends Tms {
        value: number = 0;
        $plus() {
            this.value++;
        }
    }
    class Count2 extends Count1 {
        $setCount(value: number) {
            this.value = value;
        }
        $plus() {
            this.value += 2;
        }
    }

    const count = new Count2();
    count.$setCount(1000);
    expect(count.value).toBe(1000);
    count.$plus();
    expect(count.value).toBe(1002);
});