import "jest";
import fs from "fs";
import salesforceConnection from "../../src/server/repositories/salesforceConnection";

describe("test", () => {
  it("should", () => {
    salesforceConnection().then((conn) => {
      const contents = fs.readFileSync("./tests/sandbox/cat.jpg");
      const base64data = new Buffer(contents).toString("base64");
      conn.sobject("ContentVersion")
        .insert({
          ReasonForChange : "First Upload",
          PathOnClient : "Cat.jpg",
          ContentLocation : "S",
          VersionData: base64data
        })
        .then((resp) => {
          console.log(resp);

          const id = resp.id;
          conn.sobject("ContentVersion").retrieve(id).then((resp) => {
            console.log(resp);
            const contentDocumentId = resp.ContentDocumentId;
            conn.sobject("ContentDocumentLink").insert({
              ContentDocumentId: contentDocumentId,
              LinkedEntityId: "a0C1j0000004cJIEAY",
              ShareType: "V"
            }).then((resp) => {
              console.log(resp);
            }).catch((err) => {
              console.log(err);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
