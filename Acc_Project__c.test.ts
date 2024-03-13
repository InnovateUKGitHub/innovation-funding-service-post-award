import { describe, expect, test } from "@jest/globals";
import { projectBuilder } from "./Acc_Project__c";
import { contactBuilder } from "./Acc_Contact__c";

describe("Acc_Project__c Factory Builder", () => {
  test("Expect apex to be built with no variables", () => {
    const parent = projectBuilder.new();
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with a single variable", () => {
    const parent = projectBuilder.new().setField("Acc_ProjectTitle__c", "Network Health Analysis CATAPULT - Phase 2");
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with parent/child relationship", () => {
    const contact = contactBuilder.new().setField("Title", "EUI Small Ent Health");
    const parent = projectBuilder
      .new()
      .setField("Acc_ProjectTitle__c", "Network Health Analysis CATAPULT - Phase 2")
      .setRelationship("Acc_Contact__r", [contact]);
    expect(parent.build()).toMatchSnapshot();
  });
});
