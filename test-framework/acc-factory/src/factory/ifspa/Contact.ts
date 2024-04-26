import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { AccFieldType, AccRelationshipType } from "../../types/AccFactoryDefinition";
import { AccFactory } from "../AccFactory";
import { accountBuilder } from "./Account";

const contactBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Contact",
      fields: [
        { sfdcName: "ContactMigrationId__c", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "FirstName", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "Email", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
      ],
      relationships: [
        { sfdcName: "AccountId", sfdcType: AccRelationshipType.SINGLE, sffBuilder: accountBuilder, required: true },
      ],
    },
    generator: {
      varName: x => `contact${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Contact ${instanceName} = new Contact();
${injectFieldsToApex(options, instanceName, fields)}
${injectRelationshipToApex(instanceName, "AccountId", relationships.AccountId)}
insert ${instanceName};
      `,
      priority: AccOrder.CONTACT_LOAD,
    },
  ],
);

export { contactBuilder };
