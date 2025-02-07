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
      name: "accat",
      wait: "120",
      "no-prompt": true,
    },
  });
};

main();
