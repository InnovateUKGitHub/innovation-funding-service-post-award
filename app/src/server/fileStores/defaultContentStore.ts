import fs from "fs";

export interface IDefaultContentStore {
  getContent(): Promise<string>;
}

export class DefaultContentStore implements IDefaultContentStore {
  getContent() {
    return new Promise<string>((resolve, reject) => {
      fs.readFile("./content/defaultContent.en.json", { encoding: "utf-8", }, (err, data) => {
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
