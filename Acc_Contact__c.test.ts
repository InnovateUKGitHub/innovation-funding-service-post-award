import { describe, expect, test } from "@jest/globals";
import { contactBuilder } from "./Acc_Contact__c";

describe("Acc_Contact__c Factory Builder", () => {
  test("Expect apex to be built with no variables", () => {
    const parent = contactBuilder.new();
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with a single variable", () => {
    const parent = contactBuilder.new().setField("Title", "EUI Small Ent Health");
    expect(parent.build()).toMatchSnapshot();
  });
});
