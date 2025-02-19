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
    buildProcess.onResolve({ filter: /@innovateuk\/logger/ }, () => {
      return { path: path.join(require.resolve("@innovateuk/logger"), "..", "clientIndexReplacement.js") };
    });
  },
};

module.exports = replaceModulesPlugin;
