export function initChannel<T>() {
    const channel = new Channel<T>();
    return {tx: channel.tx, rx: channel.rx}
}

class Channel<T> {
    tx: Sender<T>;
    rx: Receiver<T>;

    constructor() {
        this.tx = new Sender();
        this.rx = new Receiver();
        this.tx.link(this.rx.getResolver())
    }
}

export class Sender<T> {
    #resolve!: (value: T) => void;

    link(resolver: (val: T) => void) {
        this.#resolve = resolver;
    }

    send(value: T) {
        this.#resolve(value); 
    }
}

export class Receiver<T> {
    #resolver!: (value: T) => void;
    #promise: Promise<T>;

    constructor() {
        this.#promise = new Promise<T>((r) => {
            this.#resolver = r;
        });
    }

    getResolver(): (value: T) => void {
        return this.#resolver;
    }

    async recv() {
        return this.#promise;
    }
}
