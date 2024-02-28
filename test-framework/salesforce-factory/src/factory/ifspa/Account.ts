import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex } from "../../helpers/apex";
import { SffFieldType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";

const accountBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Account",
      fields: [
        { sfdcName: "OrgMigrationId__c", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Name", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "BillingStreet", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "BillingCity", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "BillingState", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "BillingPostalCode", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "BillingCountry", sfdcType: SffFieldType.STRING, nullable: false },
      ],
      relationships: [],
    },
    generator: {
      varName: x => `account${x}`,
    },
  },
  ({ fields, instanceName, options }) => [
    {
      code: `
Account ${instanceName} = new Account();
${injectFieldsToApex(options, instanceName, fields)}
insert ${instanceName};
      `,
      priority: AccOrder.ACCOUNT_LOAD,
    },
  ],
);

const defaultAccount = accountBuilder
  .new()
  .setField("BillingStreet", "North Star Avenue")
  .setField("BillingCity", "Swindon")
  .setField("BillingState", "Wiltshire")
  .setField("BillingPostalCode", "SN2 1SZ")
  .setField("BillingCountry", "United Kingdom");

export { accountBuilder, defaultAccount };
