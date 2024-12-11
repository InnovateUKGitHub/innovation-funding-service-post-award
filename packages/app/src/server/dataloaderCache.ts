import TTLCache from "@isaacs/ttlcache";
import DataLoader from "dataloader";
import { LRUCache } from "lru-cache";
import { configuration } from "./features/common/config";
import { DataloaderNotFoundError } from "./repositories/errors";

class CachedDataloaderFactory<T> {
  dataloaderCache: TTLCache<string, DataLoader<string, T | DataloaderNotFoundError>>;
  dataloaderOptions: DataLoader.Options<string, T> | undefined;

  constructor({ dataloaderOptions }: { dataloaderOptions?: DataLoader.Options<string, T> } = {}) {
    this.dataloaderCache = new TTLCache<string, DataLoader<string, T>>({
      ttl: configuration.timeouts.dataloaderCache * 60 * 1000,
      updateAgeOnGet: true,
    });
    this.dataloaderOptions = dataloaderOptions;
  }

  getDataloader(key: string, batchFn: DataLoader.BatchLoadFn<string, T>) {
    const existingLoader = this.dataloaderCache.get(key);
    if (existingLoader) return existingLoader;

    const cache = new LRUCache<string, Promise<T | DataloaderNotFoundError>>({
      max: 1000,
      ttl: configuration.timeouts.dataloaderCache * 60 * 1000,
    });

    const newLoader = new DataLoader<string, T | DataloaderNotFoundError>(batchFn, {
      cacheMap: cache,
      ...this.dataloaderOptions,
    });

    this.dataloaderCache.set(key, newLoader);

    return newLoader;
  }
}

export { CachedDataloaderFactory };
