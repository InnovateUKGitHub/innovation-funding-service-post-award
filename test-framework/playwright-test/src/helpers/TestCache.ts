interface TestCacheOptions {
  cache?: "use" | "ignore";
}

class TestCache {
  private readonly localCache = new Map<string, string>();

  public async cache(
    keygen: string | string[],
    longTask: () => Promise<string>,
    shortTask: (memo: string) => Promise<void>,
    options: TestCacheOptions = { cache: "use" },
  ): Promise<void> {
    const key = JSON.stringify(keygen);
    const cachedValue = this.localCache.get(key);

    if (cachedValue) {
      await shortTask(cachedValue);
    } else {
      const newValue = await longTask();
      this.localCache.set(key, newValue);
    }
  }

  public set(key: string, value: string) {
    this.localCache.set(key, value);
  }

  public get(key: string) {
    return this.localCache.get(key);
  }
}

const testCache = new TestCache();

export { TestCache, testCache };
