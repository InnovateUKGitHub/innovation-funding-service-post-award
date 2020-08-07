// tslint:disable:no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { InitialiseContentCommand } from "@server/features/general/initialiseContentCommand";

describe("InitialiseContentCommand", () => {
  it("sets content using default file content", async () => {
    const context = new TestContext();

    const content = { expected: "setting" };

    context.resources.defaultContent.setContent(JSON.stringify(content));
    context.resources.crdCompetitionContent.setContent(JSON.stringify(content));

    await context.runCommand(new InitialiseContentCommand(false));

    expect(context.internationalisation.resourceBundles.length).toBe(2);
    expect(context.internationalisation.resourceBundles[0]).toEqual(content);

  });

  it("does not reset default content", async () => {
    const context = new TestContext();

    context.resources.defaultContent.setContent(JSON.stringify({ expected: "setting" }));
    context.resources.crdCompetitionContent.setContent(JSON.stringify({ expected: "setting" }));

    await context.runCommand(new InitialiseContentCommand(false));
    await context.runCommand(new InitialiseContentCommand(false));

    expect(context.internationalisation.resourceBundles.length).toBe(2);
  });

  it("does not set custom content if not specified", async () => {
    const context = new TestContext();

    context.resources.defaultContent.setContent(JSON.stringify({ expected: "setting" }));
    context.resources.crdCompetitionContent.setContent(JSON.stringify({ expected: "setting" }));
    context.resources.customContent.setContent(JSON.stringify({ expected: "custom setting" }));

    await context.runCommand(new InitialiseContentCommand(false));

    expect(context.internationalisation.resourceBundles.length).toBe(2);
  });

  it("does sets custom content if specified", async () => {
    const context = new TestContext();

    context.resources.defaultContent.setContent(JSON.stringify({ expected: "setting" }));
    context.resources.crdCompetitionContent.setContent(JSON.stringify({ expected: "setting" }));
    context.resources.customContent.setContent(JSON.stringify({ expected: "custom setting" }));

    await context.runCommand(new InitialiseContentCommand(true));

    expect(context.internationalisation.resourceBundles.length).toBe(3);
    expect(context.internationalisation.getValue("expected")).toBe("custom setting");
  });

  it("does sets custom content if updated", async () => {
    const context = new TestContext();

    context.resources.defaultContent.setContent(JSON.stringify({ expected: "setting" }));
    context.resources.crdCompetitionContent.setContent(JSON.stringify({ expected: "setting" }));
    await context.runCommand(new InitialiseContentCommand(true));
    expect(context.internationalisation.getValue("expected")).toBe("setting");

    context.resources.customContent.setContent(JSON.stringify({ expected: "custom setting" }));
    await context.runCommand(new InitialiseContentCommand(true));
    expect(context.internationalisation.getValue("expected")).toBe("custom setting");
  });
});
