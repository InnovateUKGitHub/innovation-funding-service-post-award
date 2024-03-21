import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";
import { accProjectBuilder } from "./Acc_Project__c";
import { accountBuilder } from "./Account";
import { contactBuilder } from "./Contact";
import { userBuilder } from "./User";

const accProjectContactLinkBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Acc_ProjectContactLink__c",
      fields: [
        { sfdcName: "Acc_Role__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_EmailOfSFContact__c", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
      ],
      relationships: [
        {
          sfdcName: "Acc_ProjectId__c",
          sfdcType: SffRelationshipType.SINGLE,
          sffBuilder: accProjectBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_AccountId__c",
          sfdcType: SffRelationshipType.SINGLE,
          sffBuilder: accountBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_ContactId__c",
          sfdcType: SffRelationshipType.SINGLE,
          sffBuilder: contactBuilder,
          required: true,
        },
        { sfdcName: "Acc_UserId__c", sfdcType: SffRelationshipType.SINGLE, sffBuilder: userBuilder, required: false },
      ],
    },
    generator: {
      varName: x => `pcl${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Acc_ProjectContactLink__c ${instanceName} = new Acc_ProjectContactLink__c();
${injectFieldsToApex(options, instanceName, fields)}
${injectRelationshipToApex(instanceName, "Acc_ProjectId__c", relationships.Acc_ProjectId__c)}
${injectRelationshipToApex(instanceName, "Acc_AccountId__c", relationships.Acc_AccountId__c)}
${injectRelationshipToApex(instanceName, "Acc_ContactId__c", relationships.Acc_ContactId__c)}
${injectRelationshipToApex(instanceName, "Acc_UserId__c", relationships.Acc_UserId__c)}
insert ${instanceName};
      `,
      priority: AccOrder.ACCOUNT_LOAD,
    },
  ],
);

export { accProjectContactLinkBuilder };
