import "jest";
import fs from "fs";
import {salesforceConnection} from "../../src/server/repositories/salesforceConnection";
import {ContentDocumentLinkRepository} from "../../src/server/repositories/contentDocumentLinkRepository";
import {ContentVersionRepository} from "../../src/server/repositories/contentVersionRepository";
import {ClaimDetailsRepository} from "../../src/server/repositories";

const getSalesforceConnection = () => salesforceConnection({username:"", password: "", token: ""});

xdescribe("test", () => {
  it("should", () => {
    getSalesforceConnection().then((conn) => {
      const contents = fs.readFileSync("./tests/sandbox/cat.jpg");
      const base64data = new Buffer(contents).toString("base64");
      conn.sobject("ContentVersion")
        .insert({
          ReasonForChange : "First Upload",
          PathOnClient : "cat.jpg",
          ContentLocation : "S",
          VersionData: base64data
        })
        .then((resp1: any) => {
          console.log(resp1);
          const id = resp1.id;
          conn.sobject("ContentVersion").retrieve(id).then((resp2:any) => {
            console.log(resp2);
            const contentDocumentId = resp2.ContentDocumentId;
            conn.sobject("ContentDocumentLink").insert({
              ContentDocumentId: contentDocumentId,
              LinkedEntityId: "a061j0000007GwQAAU",
              ShareType: "V"
            }).then((resp3) => {
              console.log(resp3);
              return resp3;
            }).then((resp4) => {



              conn.sobject("ContentDocumentLink")
                .select('ContentDocumentId')
                .where("LinkedEntityId = 'a061j0000007GwQAAU'")
                .execute()
                .then((resp5:any) => {
                  console.log(resp5);
                  conn.sobject("ContentVersion")
                    .select('VersionData')
                    .where(`ContentDocumentId = '${resp5[0].ContentDocumentId}'`)
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
  it("should get documents", () => {
    new ContentDocumentLinkRepository(getSalesforceConnection)
      .getAllForEntity("a061X000000IubVQAS")
      .then((linkedDocs) => {
        return new ContentVersionRepository(getSalesforceConnection).getDocuments(linkedDocs.map(x => x.ContentDocumentId));
      })
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

describe("test3", () => {
  it("should write to a file", () => {
    new ContentVersionRepository(getSalesforceConnection).getDocumentData('0681X00000099mIQAQ')
      .then(x => {
        const fileOut = fs.createWriteStream('./sample.pdf', {
          encoding: "base64"
        });
        x.pipe(fileOut);
      });
  });
});

describe("test6", () => {
  it("should get claim detail", () => {
    new ClaimDetailsRepository(getSalesforceConnection)
      .get("a0B1j000000A4UiEAK", 1,"a071j000000Ozk3AAC")
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  });
});
