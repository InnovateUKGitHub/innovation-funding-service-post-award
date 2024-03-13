import { describe, expect, test } from "@jest/globals";
import { SffBuilder } from "./SffBuilder";
import { injectFieldsToApex, injectRelationshipToApex, injectRelationshipsToApex, sss } from "../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../types/SffFactoryDefinition";

describe("Salesforce Factory Builder", () => {
  const childBuilder = new SffBuilder(
    <const>{
      definition: {
        sfdcName: "Child",
        fields: [{ sfdcName: "var", sfdcType: SffFieldType.STRING, nullable: false }],
        relationships: [],
      },
      generator: {
        fnName: x => "mkChild" + x,
        varName: x => "child" + x,
      },
    },
    ({ fields, varName }) => {
      return {
        code: `
          Child ${varName} = new Child();
          ${injectFieldsToApex(varName, fields)}
          ${varName}.parentId = parentId;
          insert ${varName};
        `,
      };
    },
  );

  const parentBuilder = new SffBuilder(
    <const>{
      definition: {
        sfdcName: "Parent",
        fields: [{ sfdcName: "var", sfdcType: SffFieldType.STRING, nullable: false }],
        relationships: [
          { sfdcName: "child", sfdcType: SffRelationshipType.SINGLE, sffBuilder: childBuilder },
          { sfdcName: "childArray", sfdcType: SffRelationshipType.MULTI, sffBuilder: childBuilder },
        ],
      },
      generator: {
        fnName: x => "mkParent" + x,
        varName: x => "parent" + x,
      },
    },
    ({ fields, relationships, fnName, varName }) => {
      return {
        code: `
          Parent ${varName} = new Parent();
          ${injectFieldsToApex(varName, fields)}
          ${injectRelationshipToApex(varName, "child", relationships.child)}
          insert ${varName};
          ${injectRelationshipsToApex(varName, relationships.childArray)}
        `,
      };
    },
  );

  test("Expect apex to be built with no variables", () => {
    const parent = childBuilder.new();
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with a single variable", () => {
    const parent = childBuilder.new().setField("var", "My fancy title");
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with parent/child relationships", () => {
    const child1 = childBuilder.new().setField("var", "My child 1");
    const child2 = childBuilder.new().setField("var", "My child 1");
    const child3 = childBuilder.new().setField("var", "My child 1");
    const parent = parentBuilder
      .new()
      .setField("var", "My fancy title")
      .setRelationship("child", child1)
      .setRelationship("childArray", [child2, child3]);

    expect(parent.build()).toMatchSnapshot();
  });
});
