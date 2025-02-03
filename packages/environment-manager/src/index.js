const yaml = require("yaml");
const childProcess = require("node:child_process");
const path = require("node:path");
const fs = require("fs");

class EnvironmentManager {
  /**
   * @type Record<string, string>
   */
  sopsEnv = {};

  /**
   * @type Record<string, string>
   */
  configmapEnv = {};

  constructor(environment) {
    if (typeof environment === "string") {
      const kustomize = path.resolve(__dirname, "..", "..", "..", "kustomize");
      const sopsFile = path.resolve(
        kustomize,
        "acc-secrets",
        "secrets",
        "acc-ui-secret",
        `acc-ui-secret.${environment}.yml`,
      );
      const configmapFile = path.resolve(kustomize, "config-mgmt", "env", "aws", environment, "acc-ui-configmap.yml");

      if (fs.existsSync(configmapFile)) {
        const configmapData = fs.readFileSync(configmapFile, { encoding: "utf-8" });
        this.configmapEnv = yaml.parse(configmapData).data;
      }

      if (fs.existsSync(sopsFile)) {
        const sops = childProcess.spawnSync("sops", ["--decrypt", sopsFile], {
          stdio: "pipe",
          encoding: "utf-8",
        });

        this.sopsEnv = sops.stdout ? yaml.parse(sops.stdout).stringData : {};
      }
    }
  }

  /**
   * Get the env
   * @param {string} key The environment variable to grab
   * @returns {string | undefined} The text value of the environment variable
   */
  getEnv(key) {
    return (
      this.configmapEnv[key] ??
      this.sopsEnv[key] ??
      process.env[key] ??
      console.error(`Cannot find environment variable associated with ${key}`)
    );
  }
}

module.exports = { EnvironmentManager };
