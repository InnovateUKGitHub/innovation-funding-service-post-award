import { allLanguages, allNamespaces } from "@copy/data";
import { InitialiseContentCommand } from "@server/features/general/initialiseContentCommand";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("InitialiseContentCommand", () => {
  it("does not set custom content if not specified", async () => {
    const context = new TestContext();

    context.resources.customContent.setContent(JSON.stringify({ expected: "custom setting" }));

    await context.runCommand(new InitialiseContentCommand(false));

    // The number of imported bundles should be languages x namespaces
    expect(context.internationalisation.resourceBundles.length).toBe(allLanguages.length * allNamespaces.length);
  });

  it("does sets custom content if specified", async () => {
    const context = new TestContext();

    context.resources.customContent.setContent(JSON.stringify({ expected: "custom setting" }));

    await context.runCommand(new InitialiseContentCommand(true));

    // The number of imported bundles should be languages x namespaces + the custom namespace
    expect(context.internationalisation.resourceBundles.length).toBe(allLanguages.length * allNamespaces.length + 1);
    expect(context.internationalisation.getValue("expected")).toBe("custom setting");
  });

  it("does sets custom content if updated", async () => {
    const context = new TestContext();

    await context.runCommand(new InitialiseContentCommand(true));
    expect(context.internationalisation.getValue("expected")).toBe(null);

    context.resources.customContent.setContent(JSON.stringify({ expected: "custom setting" }));
    await context.runCommand(new InitialiseContentCommand(true));
    expect(context.internationalisation.getValue("expected")).toBe("custom setting");
  });
});
