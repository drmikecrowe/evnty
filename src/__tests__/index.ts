import event, { Event } from "../index";

describe("Anonymous Event test suite", function() {
  it("Should be instantiable", () => {
    expect(() => new Event()).not.toThrow();
  });

  it("Should be instantiable", () => {
    expect(() => event()).not.toThrow();
  });

  it("Should call parent constructor", () => {
    const EventOriginal = Object.getPrototypeOf(Event);
    const EventMock = jest.fn();

    Object.setPrototypeOf(Event, EventMock);

    expect(() => new Event()).not.toThrow();
    expect(EventMock).toHaveBeenCalled();

    Object.setPrototypeOf(Event, EventOriginal);
  });

  it("Should be callable", () => {
    const event = new Event();
    expect(() => event()).not.toThrow();
  });

  it("Should check event existence", () => {
    const event = new Event();
    const listener = jest.fn();
    event.on(listener);
    expect(event.has(listener)).toEqual(true);
  });

  it("Should add event listener", () => {
    const event = new Event();
    const listener = jest.fn();
    event.on(listener);
    event("test");
    expect(event.size).toEqual(1);
    expect(listener).toHaveBeenCalledWith("test");
  });

  it("Should remove event listener", () => {
    const event = new Event();
    const listener = jest.fn();
    event.on(listener);
    event.off(listener);
    event("test");
    expect(listener).not.toHaveBeenCalled();
  });

  it("Should unsubscribe event", () => {
    const event = new Event();
    const listener = jest.fn();
    const unsubscribe = event.on(listener);
    unsubscribe();
    event("test");
    expect(listener).not.toHaveBeenCalled();
  });

  it("Should add one time event listener", () => {
    const event = new Event();
    const listener = jest.fn();
    event.once(listener);
    event("test");
    event("test");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("Should clear all events", () => {
    const event = new Event();
    const listener = jest.fn();
    event.on(listener);

    event.clear();
    expect(event.size).toEqual(0);

    event("test");
    expect(listener).not.toHaveBeenCalled();
  });

  it("Should merge multiple events", () => {
    const listener = jest.fn();

    const event1 = new Event();
    const event2 = new Event();
    const event3 = new Event();
    const mergedEvent = Event.merge(event1, event2, event3);
    mergedEvent.on(listener);

    event1(1);
    event2(2);
    event3(3);
    mergedEvent(123);

    expect(listener).toHaveBeenCalledTimes(4);
    expect(listener).toHaveBeenNthCalledWith(1, 1);
    expect(listener).toHaveBeenNthCalledWith(2, 2);
    expect(listener).toHaveBeenNthCalledWith(3, 3);
    expect(listener).toHaveBeenNthCalledWith(4, 123);
  });

  it("Should only call the most recently added listener", () => {
    const event = new Event();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();
    event.on(listener1);
    event.on(listener2);
    event.on(listener3);
    event("test");
    expect(listener1).toHaveBeenCalledTimes(0);
    expect(listener2).toHaveBeenCalledTimes(0);
    expect(listener3).toHaveBeenCalledTimes(1);
  });
});
