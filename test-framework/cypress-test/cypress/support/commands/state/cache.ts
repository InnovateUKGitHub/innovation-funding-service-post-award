interface CacheOptions {
  cache?: "use" | "ignore";
}

/**
 * Cache a long task's return string and use it for subsequent calls with a shorter task
 *
 * @param keygen The string (array) to recall a cached string
 * @param longTask A longer task that generates a string
 * @param shortTask The shorter task that uses the string
 */
const cache = (
  keygen: string | string[],
  longTask: () => Cypress.Chainable<string>,
  shortTask: (memo: string) => void,
  options: CacheOptions = { cache: "use" },
) => {
  const key = "cache." + JSON.stringify(keygen);

  cy.accTask("getCyCache", { key }).then((cachedValue: string | null) => {
    cy.log(`cache / ${key} - Existing value ${cachedValue}`);

    if (cachedValue) {
      cy.log(`cache / ${key} - Using existing value`);
      shortTask(cachedValue);
    } else {
      longTask().then((newCacheValue: string) => {
        cy.log(`cache / ${key} - Saving new value ${newCacheValue}`);
        cy.accTask("setCyCache", { key, value: newCacheValue });
      });
    }
  });
};

const cacheCommands = {
  cache,
} as const;

export { cacheCommands, CacheOptions };
