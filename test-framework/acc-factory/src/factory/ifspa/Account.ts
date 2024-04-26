import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex } from "../../helpers/apex";
import { AccFieldType } from "../../types/AccFactoryDefinition";
import { AccFactory } from "../AccFactory";

const accountBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Account",
      fields: [
        { sfdcName: "OrgMigrationId__c", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Name", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "BillingStreet", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "BillingCity", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "BillingState", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "BillingPostalCode", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "BillingCountry", sfdcType: AccFieldType.STRING, nullable: false },
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

const defaultAccount = accountBuilder.new().set({
  BillingStreet: "North Star Avenue",
  BillingCity: "Swindon",
  BillingState: "Wiltshire",
  BillingPostalCode: "SN2 1SZ",
  BillingCountry: "United Kingdom",
});

export { accountBuilder, defaultAccount };
