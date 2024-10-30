export interface ICache<T> {
  fetch(key: string, get: () => T): T;
  fetchAsync(key: string, get: () => Promise<T>): Promise<T>;
  set(key: string, item: T): T;
  clear(key: string): void;
}
