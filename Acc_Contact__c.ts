import { injectFieldsToApex } from "./test-framework/salesforce-factory/src/helpers/apex";
import { SffFieldType } from "./test-framework/salesforce-factory/src/types/SffFactoryDefinition";
import { SffBuilder } from "./test-framework/salesforce-factory/src/factory/SffBuilder";

const contactBuilder = new SffBuilder(
  <const>{
    definition: {
      sfdcName: "Acc_Contact__c",
      fields: [{ sfdcName: "Title", sfdcType: SffFieldType.STRING, nullable: false }],
      relationships: [],
    },
    generator: {
      fnName: x => "createContact" + x,
      varName: x => "contact" + x,
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
      fnName: `createContact${fnNumber}`,
      varName: `contact${fnNumber}`,
    };
  },
);

export { contactBuilder };
