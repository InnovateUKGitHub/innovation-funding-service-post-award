import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldsToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";

const accountBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Account",
      fields: [
        { sfdcName: "OrgMigrationId__c", sfdcType: ProjectFactoryFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Name", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "BillingStreet", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "BillingCity", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "BillingState", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "BillingPostalCode", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "BillingCountry", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
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
      priority: ProjectFactoryApexInjectionOrder.ACCOUNT_LOAD,
    },
  ],
);

const defaultAccount = accountBuilder.create().set({
  BillingStreet: "North Star Avenue",
  BillingCity: "Swindon",
  BillingState: "Wiltshire",
  BillingPostalCode: "SN2 1SZ",
  BillingCountry: "United Kingdom",
});

export { accountBuilder, defaultAccount };
