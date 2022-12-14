import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    // baseUrl: "https://www-acc-dev.apps.ocp4.innovateuk.ukri.org",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
