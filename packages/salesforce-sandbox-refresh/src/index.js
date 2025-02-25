// @ts-check
const { EnvironmentManager } = require("@innovateuk/environment-manager");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const sf = require("./sf");
const { program, Option } = require("commander");

program.addOption(new Option("--sandbox <sandbox>", "salesforce sandbox").choices(["accat", "rafadev1"]));
program.parse();

const { sandbox } = program.opts();

const main = async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "sfdc-"));
  const envman = new EnvironmentManager("prod");

  const privateKey = path.resolve(folder, "privateKey");
  await fs.writeFile(privateKey, envman.getEnv("SALESFORCE_PRIVATE_KEY"), {
    encoding: "utf-8",
  });
  const clientId = envman.getEnv("SALESFORCE_CLIENT_ID");
  const username = envman.getEnv("SALESFORCE_USERNAME");

  await sf({
    argv: ["org", "login", "jwt"],
    flags: {
      "client-id": clientId,
      "jwt-key-file": privateKey,
      username,
    },
  });

  // await sf({
  //   argv: ["org", "refresh", "sandbox"],
  //   flags: {
  //     "target-org": username,
  //     name: sandbox,
  //     wait: "120",
  //     "no-prompt": true,
  //   },
  // });

  // const data = await sf({
  //   argv: ["data", "query"],
  //   flags: {
  //     "target-org": username,
  //     "result-format": "json",
  //     query:
  //       "SELECT Acc_ActiveFlag__c, Acc_DisplayOrder__c, Acc_QuestionDescription__c, Acc_QuestionName__c, Acc_QuestionScore__c, Acc_QuestionText__c, Acc_ScoredQuestion__c FROM Acc_MonitoringQuestion__c",
  //   },
  //   output: "string",
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
