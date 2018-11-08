export class Cache<T> {
  private store: { [key: string]: T } = {};
  private timeouts: { [key: string]: NodeJS.Timer } = {};

  constructor(private minutes: number) {

  }

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
    this.timeouts[key] = setTimeout(() => this.clear(key), this.minutes * 60 * 1000);
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
