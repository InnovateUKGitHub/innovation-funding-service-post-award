import { describe, expect, test } from "@jest/globals";
import { SffBuilder } from "../src/factory/SalesforceFactory";
import { sss } from "../src/helpers/apex";
import { SffFieldType, SffRelationshipType } from "../src/types/SffFactoryDefinition";

describe("builder", () => {
  const childBuilder = new SffBuilder(
    <const>{
      definition: {
        sfdcName: "Child",
        fields: [{ sfdcName: "var", sfdcType: SffFieldType.STRING, nullable: false }],
        relationships: [],
      },
    },
    ({ fields, fnNumber, fnBodies }) => {
      fnBodies.push(`
        Id createChild${fnNumber} {
          Child child = new Child();
          ${Object.entries(fields).map(([key, value]) => `child.${key} = ${sss(value)}`)}
          Database.insert(child);
        }
      `);

      return `createChild${fnNumber}()`;
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
    },
    ({ fields, relationships, fnNumber, fnBodies }) => {
      fnBodies.push(`
        Id createParent${fnNumber} {
          Parent parent = new Parent();
          ${Object.entries(fields).map(([key, value]) => `parent.${key} = ${sss(value)}`)}
          ${Object.entries(relationships).map(([key, value]) => {
            if (Array.isArray(value)) {
              const fnNames = value.map(x => x.build(fnBodies).fnName)
              return `parent.`
            } else {
              const { fnName } = value.build(fnBodies);
              return `parent.${key} = ${fnName}`;
            }
          })}
          Database.insert(parent);
        }
      `);

      return `createChild${fnNumber}()`;
    },
  );

  test("Expect code to gen", () => {
    expect(childBuilder.new().build()).toMatchSnapshot();
  });

  test("Expect more code to gen", () => {
    expect(childBuilder.new().setField("Title", "My fancy title").build()).toMatchSnapshot();
  });
});
