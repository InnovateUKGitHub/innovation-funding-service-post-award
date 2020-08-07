import fs from "fs";

export interface ICRDCompetitionContentStore {
  getContent(): Promise<string>;
}

export class CRDCompetitionContentStore implements ICRDCompetitionContentStore {
  getContent() {
    return new Promise<string>((resolve, reject) => {
      fs.readFile("./src/content/crdCompetitionContent.en.json", { encoding: "utf-8", }, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }
}
