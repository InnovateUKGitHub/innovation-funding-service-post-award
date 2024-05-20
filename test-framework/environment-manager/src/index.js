const yaml = require("yaml");
const childProcess = require("node:child_process");
const path = require("node:path");

class EnvironmentManager {
  /**
   * @type Record<string, string>
   */
  sopsEnv;

  constructor(environment) {
    const sopsFile = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "kustomize",
      "acc-secrets",
      `acc-ui-secrets.${environment}.yml`,
    );

    console.log("Attempting to read SOPS YAML file at", sopsFile);

    const sops = childProcess.spawnSync("sops", ["--decrypt", sopsFile], {
      stdio: "pipe",
      encoding: "utf-8",
    });

    this.sopsEnv = sops.stdout ? yaml.parse(sops.stdout).stringData : {};
  }

  /**
   * Get the env
   * @param {string} key The environment variable to grab
   * @returns {string | undefined} The text value of the environment variable
   */
  getEnv(key) {
    return this.sopsEnv[key] ?? process.env[key] ?? undefined;
  }
}

module.exports = { EnvironmentManager };