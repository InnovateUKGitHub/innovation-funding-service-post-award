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
  configEnv = {};

  constructor(environment) {
    if (!environment) {
      console.log("No environment specified for Environment Manager. Will use system environment variables instead.");
      return;
    }

    const sopsFile = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "kustomize",
      "acc-secrets",
      "secrets",
      "acc-ui-secret",
      `acc-ui-secret.${environment}.yml`,
    );

    const configFile = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "kustomize",
      "config-mgmt",
      "env",
      "aws",
      environment,
      "acc-ui-configmap.yml",
    );

    if (fs.existsSync(sopsFile)) {
      console.log("Reading SOPS YAML file at", sopsFile);

      const sops = childProcess.spawnSync("sops", ["--decrypt", sopsFile], {
        stdio: "pipe",
        encoding: "utf-8",
      });

      this.sopsEnv = sops.stdout ? yaml.parse(sops.stdout).stringData : {};
    } else {
      console.log(`Cannot open SOPS YAML file`, sopsFile);
    }

    if (fs.existsSync(configFile)) {
      console.log("Reading configmap YAML file at", configFile);

      this.configEnv = yaml.parse(fs.readFileSync(configFile, { encoding: "utf-8" }))?.data ?? {};
    } else {
      console.log(`Cannot open configmap YAML file`, configFile);
    }
  }

  /**
   * Get the env
   * @param {string} key The environment variable to grab
   * @returns {string | undefined} The text value of the environment variable
   */
  getEnv(key) {
    return (
      this.sopsEnv[key] ??
      this.configEnv[key] ??
      process.env[key] ??
      console.error(`Cannot find environment variable associated with ${key}`)
    );
  }
}

module.exports = { EnvironmentManager };
