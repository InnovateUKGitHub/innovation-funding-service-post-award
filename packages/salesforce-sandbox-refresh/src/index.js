// @ts-check
const { EnvironmentManager } = require("@innovateuk/environment-manager");
const sf = require("./sf");

const main = async () => {
  const envman = new EnvironmentManager("prod");

  const privateKey = envman.getEnv("SALESFORCE_PRIVATE_KEY");
  const clientId = envman.getEnv("SALESFORCE_CLIENT_ID");
  const username = envman.getEnv("SALESFORCE_USERNAME");

  await sf({
    argv: ["org", "login", "jwt"],
    flags: {
      "client-id": clientId,
      "jwt-key-file": "/dev/stdin",
      username,
      alias: "prod",
    },
    input: privateKey,
  });

  await sf({
    argv: ["org", "refresh", "sandbox"],
    flags: {
      "target-org": "prod",
      name: "rafadev1",
      wait: "120",
      "no-prompt": true,
    },
  });

  // const data = await sf({
  //   argv: ["data", "query"],
  //   flags: {
  //     "target-org": "prod",
  //     "result-format": "json",
  //     query:
  //       "SELECT Acc_ActiveFlag__c, Acc_DisplayOrder__c, Acc_QuestionDescription__c, Acc_QuestionName__c, Acc_QuestionScore__c, Acc_QuestionText__c, Acc_ScoredQuestion__c FROM Acc_MonitoringQuestion__c",
  //   },
  //   output: "json",
  // });

  // console.log(data);

  // if (data.records) {
  // }

  // await sf({
  //   argv: ["project", "retrieve", "start"],
  //   flags: {
  //     "target-org": "cicd",
  //     metadata: "ConnectedApp:InnovateUK",
  //     "ignore-conflicts": true,
  //   },
  // });
};

main();
