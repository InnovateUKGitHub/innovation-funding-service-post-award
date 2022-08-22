/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn, ChildProcess } = require("child_process");
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

  reloadServer() {
    // If a server exists, let the server know to kill itself.
    // createServer() itself has a hook to re-create a new server.
    if (this.serverProcess) {
      console.log("Killing server!");
      fetch(`${this.url}/dev/reload`);
    }
  }

  createServer() {
    this.serverProcess = spawn("npm", ["run", "serve", "--", "--dev"], {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || "development"
      }
    });

    // If the server closes itself at any time
    this.serverProcess.on("exit", code => {
      if (code !== 0) {
        console.log(`Server quit with error code ${code}`);
      }
      this.createServer();
    });
  }

  refreshClient() {
    fetch(`${this.url}/dev/refresh`).catch(() => {
      console.log("Could not send refresh signal - is the server running?");
    });
  }

  getClientBanner() {
    return `
(() => {
  const source = new EventSource("${this.url}/dev/hook");
  console.log("Client reloader loaded!", source);

  source.onmessage = () => {
    console.log("Hello world!")
    location.reload()
  }
})();`;
  }
}

module.exports = Restarter;
