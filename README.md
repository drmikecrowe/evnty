# Prioritized Evnty

Based on [https://github.com/3axap4eHko/evnty](https://github.com/3axap4eHko/evnty)

Only fires event to the most recently added listener. Example:

```typescript
import event from "./src/index";

const evt = event();

const handler1 = (info: string) => console.log(`Handler 1 returned: ` + info);
const unsubscribe1 = evt.on(handler1);

const handler2 = (info: string) => console.log(`Handler 2 returned: ` + info);
const unsubscribe2 = evt.on(handler2);

const handler3 = (info: string) => console.log(`Handler 3 returned: ` + info);
const unsubscribe3 = evt.on(handler3);

evt("something");
```

yields:

```
$ ts-node test.ts
Handler 3 returned: something
```

## Interface

```typescript
declare type Unsubscribe = () => void;
declare type Listener = (...args: any[]) => void;
declare type Dispose = () => void;

declare class Event {
  static merge(...events: Event[]): Event;
  static interval(interval: number): Event;

  readonly size: Number;

  constructor(dispose?: Dispose);
  has(listener: Listener): boolean;
  off(listener: Listener): void;
  on(listener: Listener): Unsubscribe;
  once(listener: Listener): Unsubscribe;
  clear(): void;
}
```

## Usage

```js
import event from "evnty";

function handleClick({ button }) {
  console.log("Clicked button is", button);
}
const clickEvent = event();
const unsubscribe = clickEvent.on(handleClick);

const keyPressEvent = event();

function handleInput({ button, key }) {}

const inputEvent = Event.merge(clickEvent, keyPressEvent);
inputEvent.on(handleInput);

function handleLeftClick() {
  console.log("Left button is clicked");
}
const leftClickEvent = clickEvent.filter(({ button }) => button === "left");
leftClickEvent.on(handleLeftClick);

clickEvent({ button: "right" });
clickEvent({ button: "left" });
clickEvent({ button: "middle" });
keyPressEvent({ key: "A" });
keyPressEvent({ key: "B" });
keyPressEvent({ key: "C" });

leftClickEvent.off(handleLeftClick);
unsubscribe();
```

## License

License [The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2019 Ivan Zakharchanka

[npm-url]: https://www.npmjs.com/package/evnty
[downloads-image]: https://img.shields.io/npm/dw/evnty.svg?maxAge=43200
[npm-image]: https://img.shields.io/npm/v/evnty.svg?maxAge=43200
[travis-url]: https://travis-ci.org/3axap4eHko/evnty
[travis-image]: https://travis-ci.org/3axap4eHko/evnty.svg?branch=master
[codecov-url]: https://codecov.io/gh/3axap4eHko/evnty
[codecov-image]: https://codecov.io/gh/3axap4eHko/evnty/branch/master/graph/badge.svg?maxAge=43200
[snyk-url]: https://snyk.io/test/npm/evnty/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/3axap4eHko/evnty.svg?maxAge=43200
