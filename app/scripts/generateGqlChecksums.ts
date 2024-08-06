import fs from "fs";
import path from "path";
import { globSync } from "glob";
import { getMutationHash } from "../src/gql/utils/mutationTextSimplifier";

const pathToGqlDirectory = "src/gql/access";

const pathToSrcDirectory = "src";

const getFilenames = (directory: string, globPattern: string) => {
  const files = globSync(path.join(directory, globPattern));
  return files;
};

const mutationFilenames = getFilenames(pathToSrcDirectory, "**/*.mutation.ts");

/**
 * @type {Record<string, string>}
 */
const mutationChecksums: Record<string, string> = {};

/**
 * Go through each matched mutation filename, extract the contents and generate a sha256 hash
 * then take the name of the mutation and create a key in the mutationChecksums object
 * mapping to the sha256 hash
 */
for (const filename of mutationFilenames) {
  const contents = fs.readFileSync(filename, "utf8");
  const mutationMatch = contents.match(/graphql`([\S\s]+)`/);
  if (mutationMatch) {
    const mutation = mutationMatch[1].trim();
    const mutationNameMatch = mutation.match(/mutation (\w+)/);

    if (mutationNameMatch) {
      const mutationName = mutationNameMatch[1];
      const hash = getMutationHash(mutation, false);
      mutationChecksums[mutationName] = hash;
    }
  } else {
    console.log("failed to find mutation in", filename);
  }
}

const json = JSON.stringify(mutationChecksums, null, 2);

fs.writeFileSync(path.join(pathToGqlDirectory, "mutationChecksums.json"), json);
