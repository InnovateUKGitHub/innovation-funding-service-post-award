import { describe, expect, test } from "@jest/globals";
import { AccFactory } from "./AccFactory";
import { buildApex, injectFieldsToApex, injectRelationshipToApex } from "../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../types/SffFactoryDefinition";

describe("ACC Factory Builder", () => {
  const parentBuilder = new AccFactory(
    <const>{
      definition: {
        sfdcName: "Parent",
        fields: [{ sfdcName: "var", sfdcType: SffFieldType.STRING, nullable: true }],
        relationships: [],
      },
      generator: {
        varName: x => "parent" + x,
      },
    },
    ({ fields, instanceName, options }) => {
      return [
        {
          code: `
            Parent ${instanceName} = new Parent();
            ${injectFieldsToApex(options, instanceName, fields)}
            insert ${instanceName};
          `,
          priority: 1,
        },
      ];
    },
  );

  const childBuilder = new AccFactory(
    <const>{
      definition: {
        sfdcName: "Child",
        fields: [{ sfdcName: "var", sfdcType: SffFieldType.STRING, nullable: false }],
        relationships: [
          { sfdcName: "parent", sfdcType: SffRelationshipType.SINGLE, sffBuilder: parentBuilder, required: true },
        ],
      },
      generator: {
        varName: x => "child" + x,
      },
    },
    ({ fields, relationships, instanceName, options }) => {
      return [
        {
          code: `
            Child ${instanceName} = new Child();
            ${injectFieldsToApex(options, instanceName, fields)}
            ${injectRelationshipToApex(instanceName, "parent", relationships.parent)}
            insert ${instanceName};
          `,
          priority: 2,
        },
      ];
    },
  );

  test("Expect apex to be built with no variables", () => {
    const parent = parentBuilder.new();
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with a single variable", () => {
    const parent = parentBuilder.new().set({ var: "My fancy title" });
    expect(parent.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with a copy", () => {
    const parent = parentBuilder.new().set({ var: "My fancy title" });
    const parentCopy = parent.copy();
    expect(parentCopy.build()).toMatchSnapshot();
  });

  test("Expect apex to be built with parent/child relationships", () => {
    const parent = parentBuilder.new().set({ var: "My fancy title" });
    const child1 = childBuilder.new().set({ var: "My child 1", parent });
    const child2 = childBuilder.new().set({ var: "My child 2", parent });
    const child3 = childBuilder.new().set({ var: "My child 3", parent });

    expect(buildApex({ instances: [parent, child1, child2, child3] })).toMatchSnapshot();
  });

  test("Expect apex to NOT be built with missing relationship in build", () => {
    const child = childBuilder.new().set({ var: "Bad Apple" });

    // The child has no "parent" assigned
    expect(() => buildApex({ instances: [child] })).toThrowError();
  });

  test("Expect apex to NOT be built with missing parent in build", () => {
    const parent = parentBuilder.new().set({ var: "My fancy title" });
    const child = childBuilder.new().set({ var: "My child 1", parent });

    // The parent should also be passed in
    expect(() => buildApex({ instances: [child] })).toThrowError();
  });
});
