import { TestContext } from "../../testContextProvider";
import { InitialiseContentCommand } from "@server/features/general/initialiseContentCommand";

describe("InitialiseContentCommand", () => {
  it("sets content using default file content", async () => {
    const context = new TestContext();

    const content = { expected: "setting" };

    context.resources.defaultContent.setContent(JSON.stringify(content));

    await context.runCommand(new InitialiseContentCommand());

    expect(context.internationalisation.resourceBundles.length).toBe(1);
    expect(context.internationalisation.resourceBundles[0]).toEqual(content);

  });

  it("does not reset default content", async () => {
    const context = new TestContext();

    context.resources.defaultContent.setContent(JSON.stringify({ expected: "setting" }));

    await context.runCommand(new InitialiseContentCommand());
    await context.runCommand(new InitialiseContentCommand());

    expect(context.internationalisation.resourceBundles.length).toBe(1);
  });
});
