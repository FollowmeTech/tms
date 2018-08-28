import Dep from '../../src/dep';
import Tms from '../../src/tms';

it('dep', () => {
    const tms = new Tms();
    const dep = new Dep();
    const args = [];
    const fn = (params) => {
        args.push(params);
    };
    const fn2 = (params) => {
        args.push(params);
    };
    expect(dep.subs).toEqual([]);
    dep.addSub(fn);
    dep.addSub(fn2);
    dep.addSub(fn);
    expect(dep.subs).toEqual([fn, fn2, fn]);
    const payloadData = {
        payload: 1,
        payloads: [1],
        type: 'test',
        target: tms
    };
    dep.notify(payloadData);
    expect(args).toEqual([payloadData, payloadData, payloadData]);
    dep.removeSub(fn);
    expect(dep.subs).toEqual([fn2, fn]);
    dep.removeSub(fn);
    expect(dep.subs).toEqual([fn2]);
    dep.removeSub(fn2);
    expect(dep.subs).toEqual([]);
    dep.addSub(() => {});
    dep.addSub(() => {});
    dep.addSub(() => {});
    dep.destroy();
    expect(dep.subs).toEqual([]);
});