class Tms {
    constructor() {
        // 获取当前实例的原型链上德所有方法
        const prototype = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(prototype).forEach(type => {
            // 获取当前属性的相关描述
            const descriptor = Object.getOwnPropertyDescriptor(prototype, type);
            if (typeof descriptor !== 'undefined' && /^\$/.test(type) && typeof descriptor.value === 'function') {
                // 监听
                Object.defineProperty(this, type, {
                    ...descriptor,
                    value(...args: any[]) {
                        const res = descriptor.value.apply(this, args);
                        console.log({
                            type: type,
                            payload: args[0],
                            payloads: args,
                            target: this
                        });
                        return res;
                    }
                });
            }
        });
    }
}

class User extends Tms {
    uid = 0;
    $login(uid: number): this {
        this.uid = uid;
        return this;
    }
}


const user = new User();

user.$login(100);

/** 输出
    {
        type: '$login',
        payload: 100,
        payloads: [100],
        target: User { uid: 100 }
    }
 */