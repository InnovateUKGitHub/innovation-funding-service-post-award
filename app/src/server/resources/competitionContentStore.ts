import fs from "fs";

export interface ICompetitionContentStore {
  getContent(): Promise<string>;
}

export class CompetitionContentStore implements ICompetitionContentStore {
  getContent() {
    return new Promise<string>((resolve, reject) => {
      fs.readFile("./src/content/competition-content.en.json", { encoding: "utf-8" }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
