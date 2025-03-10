// @ts-check
const { EnvironmentManager } = require("@innovateuk/environment-manager");
const { stripPkcsKey } = require("@innovateuk/common/stripPkcsKey");
const { sf, copyData } = require("./sf");
const { program, Option } = require("commander");
const { writeTempFile, parseXml, writeXml } = require("./data");
const { makeKeypair } = require("./x509");
const fs = require("node:fs/promises");

program.addOption(
  new Option("--sandbox <sandbox>", "salesforce sandbox").choices(["accat", "rafadev1"]).makeOptionMandatory(true),
);
program.parse();

const sfMap = new Map([
  ["accat", "at"],
  ["rafadev1", "rafadev1"],
]);

/**
 * @type {{ sandbox: "rafadev1" | "accat" }} options Options
 */
const options = program.opts();

const main = async () => {
  const sfSandboxName = options.sandbox;
  const accEnvName = sfMap.get(sfSandboxName);

  const prodEnvman = new EnvironmentManager("prod");
  const sandboxEnvman = new EnvironmentManager(accEnvName);

  const privateKeyFile = await writeTempFile("privateKey", prodEnvman.getEnv("SALESFORCE_PRIVATE_KEY"));
  const clientId = prodEnvman.getEnv("SALESFORCE_CLIENT_ID");
  const prodUsername = prodEnvman.getEnv("SALESFORCE_USERNAME");
  const sandboxUsername = `${prodUsername}.${options.sandbox}`;

  /**
   * Log in to Salesforce (prod)
   */
  await sf({
    argv: ["org", "login", "jwt"],
    flags: {
      "client-id": clientId,
      "jwt-key-file": privateKeyFile,
      username: prodUsername,
    },
  });

  /**
   * Refresh selected sandbox
   * Also automatically logs into sandbox
   */
  await sf({
    argv: ["org", "refresh", "sandbox"],
    flags: {
      "target-org": prodUsername,
      name: options.sandbox,
      wait: "120",
      "no-prompt": true,
    },
  });

  /**
   * Copy data from production sandbox to scratch sandbox
   */
  // Copy monitoring questions into new sandbox
  await copyData({
    sourceOrg: prodUsername,
    targetOrg: sandboxUsername,
    sobject: "Acc_MonitoringQuestion__c",
    fields: [
      "Acc_ActiveFlag__c",
      "Acc_DisplayOrder__c",
      "Acc_QuestionDescription__c",
      "Acc_QuestionName__c",
      "Acc_QuestionScore__c",
      "Acc_QuestionText__c",
      "Acc_ScoredQuestion__c",
    ],
  });

  // Copy cost category questions into new sandbox
  await copyData({
    sourceOrg: prodUsername,
    targetOrg: sandboxUsername,
    sobject: "Acc_CostCategory__c",
    fields: [
      "Acc_CompetitionType__c",
      "Acc_CostCategoryDescription__c",
      "Acc_CostCategoryId__c",
      "Acc_CostCategoryName__c",
      "Acc_DisplayOrder__c",
      "Acc_HintText__c",
      "Acc_OrganisationType__c",
      "Acc_OverrideAwardRate__c",
      "VAT_Cost_Category__c",
    ],
  });

  await copyData({
    sourceOrg: prodUsername,
    targetOrg: sandboxUsername,
    sobject: "Acc_DocumentType__c",
    fields: ["Acc_Active__c", "Acc_CompetitionType__c", "Acc_DocumentType__c", "Acc_Label__c", "Acc_Value__c"],
  });

  /**
   * Grab the Client ID from the Salesforce sandbox
   */
  const getConnApp = await sf({
    argv: ["project", "retrieve", "start"],
    flags: {
      "target-org": sandboxUsername,
      metadata: "ConnectedApp:InnovateUK",
      "ignore-conflicts": true,
      json: true,
    },
    output: "json",
  });

  const connAppFile = getConnApp?.result?.files?.[0]?.filePath;
  if (!connAppFile) throw new Error("Connected app InnovateUK missing!");

  const connApp = await parseXml(connAppFile);
  const keypair = await makeKeypair();

  console.log(keypair);

  connApp.ConnectedApp.oauthConfig.certificate = stripPkcsKey(keypair.certificate);
  sandboxEnvman.setSecretEnv("SALESFORCE_CLIENT_ID", connApp.ConnectedApp.oauthConfig.consumerKey);
  sandboxEnvman.setSecretEnv("SALESFORCE_PRIVATE_KEY", keypair.clientKey);
  await writeXml(connAppFile, connApp);

  await sf({
    argv: ["project", "deploy", "start"],
    flags: {
      "target-org": sandboxUsername,
      metadata: "ConnectedApp:InnovateUK",
    },
  });
};

main();
