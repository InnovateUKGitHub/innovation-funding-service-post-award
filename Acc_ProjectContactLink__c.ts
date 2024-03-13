import { injectFieldsToApex } from "./test-framework/salesforce-factory/src/helpers/apex";
import { SffFieldType } from "./test-framework/salesforce-factory/src/types/SffFactoryDefinition";
import { SffBuilder } from "./test-framework/salesforce-factory/src/factory/SffBuilder";

const projectContactLinkBuilder = new SffBuilder(
  <const>{
    definition: {
      sfdcName: "Acc_Contact__c",
      fields: [{ sfdcName: "Title", sfdcType: SffFieldType.STRING, nullable: false }],
      relationships: [],
    },
  },
  ({ fields, fnNumber, fnBodies }) => {
    fnBodies.push(`
      Acc_ProjectContactLink__c contact = new Acc_ProjectContactLink__c();
      ${injectFieldsToApex("contact", fields)}
      insert contact;
      return contact.Id;
    `);

    return {
      fnName: `createProjectContactLink${fnNumber}`,
      varName: `projectContactLink${fnNumber}`,
    };
  },
);

export { projectContactLinkBuilder };
