import { Cache } from "../../../src/server/features/common/cache";

describe("Cache", () => {
  it("when item added expect item retrived", async () => {
    const cache = new Cache<number>(1);
    let i = 0;
    const valToAdd = () => ++i;

    // add two items
    expect(cache.fetch("Example", valToAdd)).toBe(1);
    expect(cache.fetch("Example2", valToAdd)).toBe(2);

    // get the original and should still be 1
    expect(cache.fetch("Example", valToAdd)).toBe(1);
  });

  it("when expires expect new item retrived", async () => {
    const delay = 100;
    const cache = new Cache<number>(delay / 60 / 1000);
    let i = 0;
    const valToAdd = () => ++i;

    // add items
    expect(cache.fetch("Example", valToAdd)).toBe(1);
    expect(cache.fetch("Example", valToAdd)).toBe(1);

    // get again and it should be new value
    await new Promise<void>(res => {
      setTimeout(() => {
        expect(cache.fetch("Example", valToAdd)).toBe(2);
        res();
      }, delay + 1);
    });
  });

  it("when item set expect the inital value replaced", async () => {
    const cache = new Cache<number>(1);
    let i = 0;
    const valToAdd = () => ++i;

    // add item
    expect(cache.fetch("Example", valToAdd)).toBe(1);
    expect(cache.fetch("Example", valToAdd)).toBe(1);

    // replace item
    expect(cache.set("Example", valToAdd())).toBe(2);

    // get again and it should be new value
    expect(cache.fetch("Example", valToAdd)).toBe(2);
  });

  it("when item cleared expect new inital retrived", async () => {
    const cache = new Cache<number>(1);
    let i = 0;
    const valToAdd = () => ++i;

    // add item
    expect(cache.fetch("Example", valToAdd)).toBe(1);

    // clear item
    cache.clear("Example");

    // get again and it should be new value
    expect(cache.fetch("Example", valToAdd)).toBe(2);
  });

  it("when item fetched async expect item retrived", async () => {
    const cache = new Cache<number>(1);
    let i = 0;
    const valToAdd = () => new Promise<number>(res => setTimeout(() => res(++i), 10));

    // add item
    expect(await cache.fetchAsync("Example", valToAdd)).toBe(1);

    // get again and it should be same value
    expect(await cache.fetchAsync("Example", valToAdd)).toBe(1);
  });
});
