/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const replaceModulesPlugin = {
  name: "replaceModulesPlugin",
  setup(buildProcess) {
    buildProcess.onResolve({ filter: /apiClient/ }, () => {
      return { path: path.join(__dirname, "../../src/client/replacement-files", "apiClient.ts") };
    });
    buildProcess.onResolve({ filter: /isomorphicFileWrapper/ }, () => {
      return { path: path.join(__dirname, "../../src/client/replacement-files", "isomorphicFileWrapper.ts") };
    });
  },
};

module.exports = replaceModulesPlugin;
