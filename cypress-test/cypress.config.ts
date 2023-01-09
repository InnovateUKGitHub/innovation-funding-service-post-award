require("dotenv").config();
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.TEST_URL || "https://www-acc-dev.apps.ocp4.innovateuk.ukri.org",
    //baseUrl: process.env.TEST_URL || "http://localhost:8080",
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        launchOptions.args.push("--disable-extensions");
      });
      //implement node event listeners here
    },
    env: {
      BASIC_AUTH: process.env.BASIC_AUTH,
    },
    testIsolation: false,
  },
});
