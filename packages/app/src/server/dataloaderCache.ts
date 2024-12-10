import TTLCache from "@isaacs/ttlcache";
import DataLoader from "dataloader";
import { LRUCache } from "lru-cache";
import { configuration } from "./features/common/config";

class CachedDataloader<T> {
  dataloaderCache: TTLCache<string, DataLoader<string, T>>;
  dataloaderOptions: DataLoader.Options<string, T> | undefined;

  constructor({ dataloaderOptions }: { dataloaderOptions?: DataLoader.Options<string, T> } = {}) {
    this.dataloaderCache = new TTLCache<string, DataLoader<string, T>>({
      ttl: configuration.timeouts.dataloaderCache * 60 * 1000,
      updateAgeOnGet: true,
    });
    this.dataloaderOptions = dataloaderOptions;
  }

  getDataloader(key: string, batchFn: DataLoader.BatchLoadFn<string, T>) {
    let dataloader = this.dataloaderCache.get(key);
    if (dataloader) return dataloader;

    const cache = new LRUCache<string, Promise<T>>({
      max: 1000,
      ttl: configuration.timeouts.dataloaderCache * 60 * 1000,
    });

    dataloader = new DataLoader<string, T>(batchFn, {
      cacheMap: cache,
      ...this.dataloaderOptions,
    });

    this.dataloaderCache.set(key, dataloader);

    return dataloader;
  }
}

export { CachedDataloader };
