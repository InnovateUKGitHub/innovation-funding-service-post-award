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

  public invalidate(keygen: string | string[]) {
    if (typeof keygen === "string") {
      this.localCache.delete(keygen);
    } else {
      nextkey: for (const keyStr in this.localCache.keys()) {
        try {
          const keyArr = JSON.parse(keyStr);
          for (let i = 0; i < keygen.length; i++) {
            if (keygen[i] !== keyArr[i]) continue nextkey;
          }
          // if keygen prefix matches entirely, delete this key
          this.localCache.delete(keyStr);
        } catch {}
      }
    }
  }

  private set(key: string, value: string) {
    this.localCache.set(key, value);
  }

  private get(key: string) {
    return this.localCache.get(key);
  }
}

const testCache = new TestCache();

export { TestCache, testCache };
