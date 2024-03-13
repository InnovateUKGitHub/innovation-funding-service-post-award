import {
  injectFieldsToApex,
  injectRelationshipToApex,
  injectRelationshipsToApex,
} from "./test-framework/salesforce-factory/src/helpers/apex";
import { SffFieldType, SffRelationshipType } from "./test-framework/salesforce-factory/src/types/SffFactoryDefinition";
import { contactBuilder } from "./Acc_Contact__c";
import { SffBuilder } from "./test-framework/salesforce-factory/src/factory/SffBuilder";

const projectBuilder = new SffBuilder(
  <const>{
    definition: {
      sfdcName: "Acc_Project__c",
      fields: [
        { sfdcName: "Acc_ProjectNumber__c", sfdcType: SffFieldType.STRING, nullable: false },
        // { sfdcName: "Acc_LegacyID__c", sfdcType: SffFieldType.STRING, nullable: true },
        { sfdcName: "Acc_ProjectTitle__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME, nullable: false },
        { sfdcName: "Acc_Duration__c", sfdcType: SffFieldType.NUMBER, nullable: false },
        { sfdcName: "Acc_WorkdayProjectSetupComplete__c", sfdcType: SffFieldType.CHECKBOX, nullable: false },
        {
          sfdcName: "Acc_MonitoringLevel__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Platinum", "Gold", "Silver", "Bronze", "Internal Assurance"],
          nullable: false,
        },
        {
          sfdcName: "Acc_MonitoringReportSchedule__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Monthly", "Quarterly", "6 Monthly", "Yearly", "Internal Assurance"],
          nullable: false,
        },
        {
          sfdcName: "Acc_ClaimFrequency",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Monthly", "Quarterly"],
          nullable: false,
        },
        {
          sfdcName: "Acc_ProjectStatus__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: [
            "Not set",
            "PCL Creation Complete",
            "Offer Letter Sent",
            "Live",
            "On Hold",
            "Final Claim",
            "Closed",
            "Terminated",
          ],
          nullable: false,
        },
        { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME, nullable: false },
      ],
      relationships: [{ sfdcName: "Acc_Contact__r", sfdcType: SffRelationshipType.MULTI, sffBuilder: contactBuilder }],
    },
  },
  ({ fields, relationships, fnNumber, fnBodies }) => {
    fnBodies.push(`
      Acc_Project__c project = new Acc_Project__c();
      ${injectFieldsToApex("project", fields)}
      insert project;
      ${injectRelationshipsToApex("project", fnBodies, relationships.Acc_Contact__r)}
      return project.Id;
    `);

    return {
      fnName: `createProject${fnNumber}`,
      varName: `project${fnNumber}`,
    };
  },
);

export { projectBuilder };
