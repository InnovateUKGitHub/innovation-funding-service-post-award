import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

const makeUrl = (): string => {
  const { ACC, SANDBOX } = process.env;
  if (ACC === "local") {
    return "http://127.0.0.1:3000";
  }

  if (ACC && SANDBOX) {
    return `https://www-acc-custom-${ACC}-${SANDBOX}.apps.ocp4.innovateuk.ukri.org`;
  }

  if (ACC) {
    return `https://www-acc-custom-${ACC}.apps.ocp4.innovateuk.ukri.org`;
  }

  if (SANDBOX) {
    return `https://www-acc-${SANDBOX}.apps.ocp4.innovateuk.ukri.org`;
  }

  return "http://127.0.0.1:3000";
};

const config: Cypress.ConfigOptions = {
  e2e: {
    baseUrl: makeUrl(),
    specPattern: "cypress/e2e/**/*.{spec.ts,feature}",
    setupNodeEvents,
    reporter: require.resolve("@badeball/cypress-cucumber-preprocessor/pretty-reporter"),
  },
};

export default config;
