const { readFile } = require("fs/promises");
const crypto = require("crypto");
const { print, parse } = require("graphql");

const makeReplacer = type => async args => {
  let contents = await readFile(args.path, "utf8");

  if (contents.includes("graphql`")) {
    let imports = [];

    contents = contents.replace(/graphql`([\s\S]*?)`/gm, (match, query) => {
      const formatted = print(parse(query));
      const name = /(fragment|mutation|query) (\w+)/.exec(formatted)[2];

      let id = `graphql__${crypto.randomBytes(10).toString("hex")}`;
      imports.push(`import ${id} from "./__generated__/${name}.graphql.ts";`);
      return id;
    });

    contents = imports.join("\n") + contents;
  }

  return {
    contents: contents,
    loader: type,
  };
};

const plugin = {
  name: "relay",
  setup: build => {
    build.onLoad({ filter: /\.tsx$/, namespace: "" }, makeReplacer("tsx"));
    build.onLoad({ filter: /\.ts$/, namespace: "" }, makeReplacer("ts"));
  },
};

module.exports = plugin;
