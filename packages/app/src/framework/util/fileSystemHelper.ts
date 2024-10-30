import fs from "fs";

export const readFile = (fileName: string) => fs.readFileSync(fileName, "utf8");
