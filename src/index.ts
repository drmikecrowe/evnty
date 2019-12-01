type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;
type Listeners = Set<Listener>;
type Dispose = () => void;
type Filter = (...args: any[]) => boolean;
type Mapper<T = any[]> = (...args: any[]) => T;
type Reducer<T = any[]> = (value: T, ...args: any[]) => T;

class FunctionExt extends Function {
  constructor(func: Function) {
    super();
    return Object.setPrototypeOf(func, new.target.prototype);
  }
}

function eventEmitter(listeners: Listeners, ...args: any[]) {
  return Promise.all([...listeners].slice(-1).map(listener => listener(...args)));
}

export class Event extends FunctionExt {
  static merge(...events: Event[]): Event {
    const mergedEvent = new Event();
    events.forEach(event => event.on((...args) => mergedEvent(...args)));
    return mergedEvent;
  }

  static interval(interval: number) {
    let timerId = 0;
    let counter = 0;
    const intervalEvent = new Event(() => clearInterval(timerId));
    timerId = setInterval(() => intervalEvent(counter++), interval);
    return intervalEvent;
  }

  private listeners: Listeners;
  readonly dispose: Dispose;

  constructor(dispose?: Dispose) {
    const listeners = new Set<Listener>();
    super(eventEmitter.bind(null, listeners));
    this.listeners = listeners;
    this.dispose = () => {
      this.clear();
      dispose && dispose();
    };
  }

  get size(): Number {
    return this.listeners.size;
  }

  has(listener: Listener): boolean {
    return this.listeners.has(listener);
  }

  off(listener: Listener): void {
    this.listeners.delete(listener);
  }

  on(listener: Listener): Unsubscribe {
    this.listeners.add(listener);
    return () => this.off(listener);
  }

  once(listener: Listener): Unsubscribe {
    const oneTimeListener = (...args: any[]) => {
      this.off(oneTimeListener);
      listener(...args);
    };
    return this.on(oneTimeListener);
  }

  clear() {
    this.listeners.clear();
  }
}

export default function event() {
  return new Event();
}
