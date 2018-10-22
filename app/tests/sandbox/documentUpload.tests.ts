import "jest";
import fs from "fs";
import salesforceConnection from "../../src/server/repositories/salesforceConnection";
import {ContentDocumentLinkRepository} from "../../src/server/repositories/contentDocumentLinkRepository";
import {ContentVersionRepository} from "../../src/server/repositories/contentVersionRepository";

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
              LinkedEntityId: "a061X000000IubVQAS",
              ShareType: "V"
            }).then((resp) => {
              console.log(resp);
              return resp;
            }).then((resp) => {



              conn.sobject("ContentDocumentLink")
                .select('ContentDocumentId')
                .where("LinkedEntityId = 'a061X000000IubVQAS'")
                .execute()
                .then(resp => {
                  console.log(resp);
                  conn.sobject("ContentVersion")
                    .select('VersionData')
                    .where(`ContentDocumentId = '${resp[0].ContentDocumentId}'`)
                    .execute()
                    .then(resp => {
                      console.log(resp);


                    })
                    .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
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

describe("test2", () => {
  it("should", () => {
    new ContentDocumentLinkRepository()
      .getAllForEntity("a061X000000IubVQAS")
      .then((linkedDocs) => {
        return new ContentVersionRepository().getDocuments(linkedDocs.map(x => x.ContentDocumentId));
      })
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  });
});
