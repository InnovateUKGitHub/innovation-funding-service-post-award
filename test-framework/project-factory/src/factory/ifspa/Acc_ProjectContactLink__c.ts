import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accProjectBuilder } from "./Acc_Project__c";
import { accountBuilder } from "./Account";
import { contactBuilder } from "./Contact";
import { userBuilder } from "./User";

const accProjectContactLinkBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Acc_ProjectContactLink__c",
      fields: [
        {
          sfdcName: "Acc_Role__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: [
            "Finance contact",
            "Monitoring officer",
            "Project Manager",
            "Innovation Lead",
            "IPM",
            "Claims Notification",
            "PCR Notification",
            "Investor",
            "Associate",
            "Company Supervisor",
            "Main Company Contact",
            "KB Supervisor",
            "Main KB Contact",
            "KB Admin",
            "KB Finance",
            "Final Report Assessor",
            "Contracting Authority",
            "Relationship Manager",
          ],
          nullable: false,
        },
        {
          sfdcName: "Acc_EmailOfSFContact__c",
          sfdcType: ProjectFactoryFieldType.STRING,
          nullable: false,
          prefixed: true,
        },
      ],
      relationships: [
        {
          sfdcName: "Acc_ProjectId__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accProjectBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_AccountId__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accountBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_ContactId__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: contactBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_UserId__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: userBuilder,
          required: false,
        },
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
      priority: ProjectFactoryApexInjectionOrder.ACC_PROJECT_CONTACT_LINK_LOAD,
    },
  ],
);

export { accProjectContactLinkBuilder };
