// @ts-check
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const xml2js = require("xml2js");

/**
 * @type {string | undefined}
 */
let tempFolder;

/**
 *
 * @param {string} name Filename
 * @param {string} content Text content to save to file
 * @returns
 */
const writeTempFile = async (name, content) => {
  if (!tempFolder) tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), "sfdc-"));
  const filename = path.resolve(tempFolder, name);

  await fs.writeFile(filename, content, {
    encoding: "utf-8",
  });

  return filename;
};

/**
 * What
 * @param {string} filepath Filename
 */
const parseXml = async filepath => {
  const parser = new xml2js.Parser({ async: true, explicitArray: false });
  const content = await fs.readFile(filepath, { encoding: "utf-8" });
  return parser.parseStringPromise(content);
};

const writeXml = async (filepath, data) => {
  const builder = new xml2js.Builder();
  const content = await builder.buildObject(data);
  return fs.writeFile(filepath, content, { encoding: "utf-8" });
};

module.exports = { writeTempFile, parseXml, writeXml };
