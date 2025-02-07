// @ts-check
const which = require("which");
const childProcess = require("node:child_process");
const path = require("node:path");

const sfdxFile = require.resolve("@innovateuk/salesforce-deluxe/sfdx-project.json");
const sfdxPath = path.parse(sfdxFile).dir;

/**
 * The Salesforce CLI
 * @param {object} props Props
 * @param {string[]=} props.argv Argument key/value array. Appends `--` to multi-char vars, and `-` to single-char flags
 * @param {Record<string, string | boolean>=} props.flags Comamand line flags
 * @param {(string | Buffer | DataView)=} props.input Input
 * @param {("stdout" | "string" | "json")=} props.output Pipe stdout to NodeJS stdout or capture in NodeJS string/object
 */
const sf = async props => {
  const env = { ...process.env, TERM: "dumb" };

  const { argv, flags, input, output } = {
    argv: [],
    flags: {},
    input: undefined,
    output: "stdout",
    ...props,
  };

  /**
   * @type {string[]}
   */
  const flag = Object.entries(flags)
    .map(([k, v]) => {
      if (v === true) return [`--${k}`];
      if (v === false) return [];
      if (v.length === 1) return [`-${k}`, String(v)];
      return [`--${k}`, String(v)];
    })
    .flat();

  const sfCli = await which("sf");

  return new Promise((resolve, reject) => {
    const child = childProcess.spawn(sfCli, [...argv, ...flag], {
      env,
      stdio: ["pipe", output === "stdout" ? "inherit" : "pipe", "inherit"],
      cwd: sfdxPath,
    });

    if (typeof input !== "undefined") {
      child.stdin.write(input);
      child.stdin.write("\n");
      child.stdin.end();
    }

    let result = "";

    child.stdout?.on("data", data => {
      result += data.toString();
    });

    child.on("exit", code => {
      if (code) reject(code);

      switch (output) {
        case "json":
          resolve(JSON.parse(result));
        case "string":
          resolve(result);
        case "stdout":
          resolve();
      }
    });
  });
};

module.exports = sf;
