// @ts-check

const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Make a string into an escaped string literal that can be injected into JavaScript as a string.
 *
 * @param {String} input The input to escape
 * @returns An escaped string identifier
 */
const makeStr = input => `"${input.replace(/"/g, '\\"')}"`;

/**
 * Run a command, returning the output as a string.
 *
 * @param {String} line The command to run
 * @returns The string output of the command
 */
const runCmd = line => childProcess.execSync(line).toString().trim();

const BUILD_DATETIME = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
});
const BUILD_GIT_COMMIT_HASH = runCmd("git rev-parse HEAD");
const BUILD_GIT_BRANCH_NAME = runCmd("git symbolic-ref --short HEAD");
const BUILD_DIRTY_FLAG = runCmd("git status --short --porcelain").length > 0 ? "-dirty" : "";

/**
 * Get the HTML header with the build information
 *
 * @param {String} bundler The bundler used to build the service
 * @returns The HTML header text
 */
const makeHtmlBuildHeader = bundler => {
  const html = `
<!--
  Innovation Funding Service (Post Award)
  Innovate UK, UK Research and Innovation

  Built with ${bundler} on ${BUILD_DATETIME}
  ${BUILD_GIT_BRANCH_NAME} (${BUILD_GIT_COMMIT_HASH}${BUILD_DIRTY_FLAG})
-->
`;

  fs.writeFileSync(path.resolve(__dirname, "..", "public", "version"), html, { encoding: "utf-8" });
};

module.exports = makeHtmlBuildHeader;
