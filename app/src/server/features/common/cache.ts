import { ICache } from "@framework/types";

export class Cache<T> implements ICache<T> {
  private readonly store: { [key: string]: T } = {};
  private readonly timeouts: { [key: string]: NodeJS.Timer } = {};

  constructor(private readonly minutes: number) {}

  fetch(key: string, get: () => T): T {
    const result = this.store[key];
    if (result) {
      return result;
    }
    return this.set(key, get());
  }

  async fetchAsync(key: string, get: () => Promise<T>): Promise<T> {
    const result = this.store[key];
    if (result) {
      return Promise.resolve(result);
    }
    return this.set(key, await get());
  }

  set(key: string, item: T): T {
    this.clear(key);
    this.store[key] = item;
    if(this.minutes) {
      this.timeouts[key] = setTimeout(() => this.clear(key), this.minutes * 60 * 1000);
    }
    return item;
  }

  clear(key: string) {
    if (this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
      delete this.timeouts[key];
    }
    delete this.store[key];
  }
}
