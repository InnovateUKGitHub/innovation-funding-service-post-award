import { useEffect, useMemo } from "react";
import { FieldValues, useForm, UseFormProps } from "react-hook-form";
import { md5 } from "js-md5";
import { useDebounce } from "@ui/components/input-utils";
import { useLocation } from "react-router-dom";

type StoreItemKey = { pathname: string; search: string; discriminator: string };
type StoreItemValue<T> = { hash: string; value: T };
type StoreItem<T> = StoreItemKey & StoreItemValue<T> & { lastSaved: Date };

interface AutosaveSettings {
  discriminator?: string;
}

class Store<T> {
  private readonly saveKey: string;

  constructor(saveKey: string) {
    this.saveKey = saveKey;
    this.garbageCollect();
  }

  private getStoreItems(): StoreItem<T>[] {
    const localStorageValue = localStorage.getItem(this.saveKey);

    if (!localStorageValue) {
      localStorage.setItem(this.saveKey, "[]");
      return [];
    }

    try {
      const items = JSON.parse(localStorageValue);

      // Only return the items if it is an array :)
      if (Array.isArray(items)) {
        // Deserialise our string
        return items.map(({ pathname, search, hash, discriminator, lastSaved, value }) => ({
          pathname,
          search,
          hash,
          discriminator,
          lastSaved: new Date(lastSaved),
          value,
        }));
      } else {
        // Initialise the array if it is not an array
        window.localStorage.setItem(this.saveKey, "[]");
        return [];
      }
    } catch {
      // Initialise the array if it is invalid json
      window.localStorage.setItem(this.saveKey, "[]");
      return [];
    }
  }

  /**
   *
   * @param {StoreItem[]} items
   */
  private saveStoreItems(items: StoreItem<T>[]) {
    // Serialise our string
    window.localStorage.setItem(
      this.saveKey,
      JSON.stringify(
        items.map(({ pathname, search, hash, discriminator, lastSaved, value }) => ({
          pathname,
          search,
          hash,
          discriminator,
          lastSaved: lastSaved.getTime(),
          value,
        })),
      ),
    );
  }

  /**
   * @param {StoreItemKey} lookup The key to look up
   * @returns {StoreItem | undefined}
   */
  getKey({ pathname, search, discriminator }: StoreItemKey) {
    const items = this.getStoreItems();
    return items.find(x => x.search === search && x.pathname === pathname && x.discriminator === discriminator);
  }

  /**
   * @param {StoreItemKey} lookup The key to save to
   * @param {any} value The value to serialise
   */
  setKey({ search, pathname, discriminator }: StoreItemKey, { hash, value }: StoreItemValue<T>) {
    const items = this.getStoreItems();
    const existingItem = items.find(
      x => x.search === search && x.pathname === pathname && x.discriminator === discriminator,
    );

    if (existingItem) {
      existingItem.lastSaved = new Date();
      existingItem.hash = hash;
      existingItem.value = value;
    } else {
      items.push({
        search,
        pathname,
        hash,
        discriminator,
        lastSaved: new Date(),
        value,
      });
    }

    this.saveStoreItems(items);
  }

  /**
   * Delete keys from localStorage
   *
   * @param {StoreItemKey[]} keys Keys to delete
   */
  deleteKeys(keys: StoreItemKey[]) {
    const items = this.getStoreItems();
    this.saveStoreItems(
      items.filter(
        x => !keys.some(y => y.pathname === x.pathname && y.search === x.search && y.discriminator === x.discriminator),
      ),
    );
  }

  garbageCollect() {
    const now = Date.now();
    const items = this.getStoreItems();
    // Only save items that are younger than 31.5 billion milliseconds
    // Thats about a calendar year.
    this.saveStoreItems(items.filter(x => now - x.lastSaved.valueOf() < 31_556_952_000));
  }

  static checkForLocalStorage() {
    const key = "ifs-localstoragesave-check";

    try {
      window.localStorage.setItem(key, key);
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Create an instance of the Store(TM) for accessing LocalStorage with arrays.
   * @returns {Store | null} Instance of Store, or null if LocalStorage is not available
   */
  static init<T>() {
    if (Store.checkForLocalStorage()) {
      const store = new Store<T>("acc-localstoragesave");
      store.garbageCollect();
      return store;
    } else {
      return null;
    }
  }
}

const hash = (text: unknown) => md5(JSON.stringify(text) ?? "undefined");

const useAutosaveForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  stdProps?: UseFormProps<TFieldValues, TContext>,
  { discriminator }: AutosaveSettings = {},
) => {
  const store = Store.init<TFieldValues>();
  const getStoreKey = () => ({
    pathname: location.pathname,
    search: location.search,
    discriminator: discriminator ?? "",
  });
  const defaultHash = hash(stdProps?.defaultValues);

  const loc = useLocation();
  const stuff2 = useMemo(() => {
    const localStorageItem = store?.getKey(getStoreKey());

    if (defaultHash === localStorageItem?.hash) {
      return localStorageItem.value;
    }
  }, [loc.pathname, loc.search]);

  const stuff = useForm<TFieldValues, TContext, TTransformedValues>({
    ...stdProps,
    values: stuff2,
  });

  const { watch } = stuff;

  const save = useDebounce(value => {
    const newHash = hash(value);

    if (defaultHash !== newHash) {
      store?.setKey(getStoreKey(), {
        hash: defaultHash,
        value,
      });
    }
  });

  const value = watch();
  useEffect(() => {
    save(value);
  }, [value]);

  return stuff;
};

export { useAutosaveForm };
