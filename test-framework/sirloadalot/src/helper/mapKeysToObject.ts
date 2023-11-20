const mapKeysToObject = <Key extends string, T>(
  Key: Array<Key> | ReadonlyArray<Key>,
  fn: (key: Key) => T
): Record<Key, T> =>
  Object.fromEntries(Key.map((key) => [key, fn(key)])) as Record<Key, T>;

export { mapKeysToObject };
