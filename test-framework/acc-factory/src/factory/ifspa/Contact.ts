import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";
import { accountBuilder } from "./Account";

const contactBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Contact",
      fields: [
        { sfdcName: "ContactMigrationId__c", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "FirstName", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Email", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
      ],
      relationships: [
        { sfdcName: "AccountId", sfdcType: SffRelationshipType.SINGLE, sffBuilder: accountBuilder, required: true },
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
