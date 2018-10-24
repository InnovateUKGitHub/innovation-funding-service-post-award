import fs from "fs";
import salesforceConnection from "../../../src/server/repositories/salesforceConnection";

const insertContentVersion = async (filePath: string) => {
  const contents = fs.readFileSync(filePath);
  const base64data = new Buffer(contents).toString("base64");
  const conn = await salesforceConnection();
  conn.sobject("ContentVersion")
    .insert({
      ReasonForChange : "First Upload",
      PathOnClient : filePath,
      ContentLocation : "S",
      VersionData: base64data
    });
};

export const insertDocument = (linkedEntity: string) => {

}
