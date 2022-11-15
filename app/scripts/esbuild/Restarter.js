/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires */
/** @typedef {import('child_process').ChildProcess} ChildProcess */
const { spawn } = require("child_process");
const fetch = require("isomorphic-fetch");

class Restarter {
  /**
   * @type {ChildProcess}
   */
  serverProcess;

  /**
   * @type {string}
   */
  url;

  constructor(url = "http://127.0.0.1:8080") {
    this.url = url;
  }

  /**
   * Tell the server to shut itself down
   */
  reloadServer() {
    // If a server exists, let the server know to kill itself.
    // createServer() itself has a hook to re-create a new server.
    if (this.serverProcess) {
      console.log("Killing server!");
      fetch(`${this.url}/dev/reload`);
    }
  }

  /**
   * Create a server development instance.
   * Will automatically restart when it exits.
   */
  createServer() {
    this.serverProcess = spawn("npm", ["run", "serve", "--", "--dev"], {
      // Copy stdout of server to current stdio
      stdio: "inherit",

      // Windows developers needs a shell so it can parse `PATH`
      // (so npm can be ran with nvm/nvs)
      shell: process.platform === "win32",

      // Set a default NODE_ENV just in case.
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || "development",
      },
    });

    // If the server closes itself at any time
    this.serverProcess.on("exit", code => {
      if (code !== 0) {
        console.log(`Server quit with error code ${code}`);
      }
      this.createServer();
    });
  }

  /**
   * Tell the client to reload.
   */
  refreshClient() {
    fetch(`${this.url}/dev/refresh`).catch(() => {
      console.log("Could not send refresh signal - is the server running?");
    });
  }

  /**
   * Returns JavaScript code (as a string) to be injected into the client JavaScript
   * for listening to `/dev/hook` and refreshing when client is rebuilt.
   *
   * @returns {string} JavaScript for listening to the `/dev/hook` endpoint on the client.
   */
  getClientBanner() {
    return `
(() => {
  const source = new EventSource(window.location.origin + "/dev/hook");
  console.log("Client reloader loaded!", source);

  source.onmessage = () => {
    location.reload()
  }
})();`;
  }
}

module.exports = Restarter;
