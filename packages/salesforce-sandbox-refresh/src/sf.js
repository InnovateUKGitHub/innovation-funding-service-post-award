// @ts-check
const which = require("which");
const childProcess = require("node:child_process");
const path = require("node:path");
const { writeTempFile } = require("./data");
const fs = require("node:fs/promises");

const sfdxFile = require.resolve("@innovateuk/salesforce-deluxe/sfdx-project.json");
const sfdxPath = path.parse(sfdxFile).dir;
const forceAppPath = path.resolve(sfdxPath, "force-app");

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

  try {
    await fs.mkdir(forceAppPath);
  } catch {}

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
      if (code !== 0) return reject(code);

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

/**
 * Copy data from a source org into a destination org
 * @param {object} props Props
 * @param {string} props.sourceOrg Username or alias for the sandbox to query the fields in
 * @param {string} props.targetOrg Username or alias for the sandbox to dump the result of the query in
 * @param {string} props.sobject Name of the SObject to query and copy records to/from
 * @param {string[]} props.fields Fields of the SObject to query and copy records to/from
 */
const copyData = async ({ sourceOrg, targetOrg, sobject, fields }) => {
  const data = await sf({
    argv: ["data", "query"],
    flags: {
      "target-org": sourceOrg,
      "result-format": "csv",
      query: `SELECT ${fields.join(", ")} FROM ${sobject}`,
    },
    output: "string",
  });

  const filename = await writeTempFile(`${sobject}.csv`, data);

  await sf({
    argv: ["data", "import", "bulk"],
    flags: {
      "target-org": targetOrg,
      file: filename,
      sobject,
      wait: "120",
    },
  });
};

module.exports = { sf, copyData };
