const fs = require("fs");
const path = require("path");

/**
 * @description This was created to avoid node mismatches between CI tasks.
 *
 * It should not rely on a build step/npm as we want this to fail fast, and speed up feedback to the build instigator
 */
(() => {
  const nodeVersion = process.versions.node;

  const nvmConfigPath = path.resolve(process.cwd(), ".nvmrc");
  const requiredNodeVersion = fs.readFileSync(nvmConfigPath, { encoding: "utf-8" });

  if (nodeVersion !== requiredNodeVersion) {
    const invalidNodeVersionMessage = `There appears to be a conflict with your current version of node. Please update to proceed with the build:
    
      Current: ${nodeVersion}
      Required: ${requiredNodeVersion}
      `;

    throw Error(invalidNodeVersionMessage);
  }
})();
