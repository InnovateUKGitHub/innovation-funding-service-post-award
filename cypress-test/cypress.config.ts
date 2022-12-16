require("dotenv").config();
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // baseUrl: process.env.TEST_URL || "https://www-acc-dev.apps.ocp4.innovateuk.ukri.org",
    baseUrl: process.env.TEST_URL || "http://localhost:8080",
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    env: {
      BASIC_AUTH: process.env.BASIC_AUTH,
    },
    testIsolation: false,
  },
});
