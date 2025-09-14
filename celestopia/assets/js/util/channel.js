var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Sender_resolve, _Receiver_resolver, _Receiver_promise;
export function initChannel() {
    const channel = new Channel();
    return { tx: channel.tx, rx: channel.rx };
}
class Channel {
    constructor() {
        this.tx = new Sender();
        this.rx = new Receiver();
        this.tx.link(this.rx.getResolver());
    }
}
export class Sender {
    constructor() {
        _Sender_resolve.set(this, void 0);
    }
    link(resolver) {
        __classPrivateFieldSet(this, _Sender_resolve, resolver, "f");
    }
    send(value) {
        __classPrivateFieldGet(this, _Sender_resolve, "f").call(this, value);
    }
}
_Sender_resolve = new WeakMap();
export class Receiver {
    constructor() {
        _Receiver_resolver.set(this, void 0);
        _Receiver_promise.set(this, void 0);
        __classPrivateFieldSet(this, _Receiver_promise, new Promise((r) => {
            __classPrivateFieldSet(this, _Receiver_resolver, r, "f");
        }), "f");
    }
    getResolver() {
        return __classPrivateFieldGet(this, _Receiver_resolver, "f");
    }
    async recv() {
        return __classPrivateFieldGet(this, _Receiver_promise, "f");
    }
}
_Receiver_resolver = new WeakMap(), _Receiver_promise = new WeakMap();
