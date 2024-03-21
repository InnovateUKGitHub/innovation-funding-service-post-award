import { AccOrder } from "../../enum/AccOrder";
import { injectFieldToApex, injectRelationshipToApex } from "../../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";
import { competitionBuilder } from "./Competition__c";

const accProjectBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Acc_Project__c",
      fields: [
        { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME, nullable: false },
        { sfdcName: "Acc_Duration__c", sfdcType: SffFieldType.NUMBER, nullable: false },
        {
          sfdcName: "Acc_ClaimFrequency__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Monthly", "Quarterly"],
          nullable: false,
        },
        { sfdcName: "Acc_ProjectTitle__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_TSBProjectNumber__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_WorkdayProjectSetupComplete__c", sfdcType: SffFieldType.CHECKBOX, nullable: false },
        { sfdcName: "Acc_NonFEC__c", sfdcType: SffFieldType.CHECKBOX, nullable: false },
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
        { sfdcName: "Acc_ClaimFrequency__c", sfdcType: SffFieldType.STRING, nullable: false },
      ],
      relationships: [
        { sfdcName: "Acc_CompetitionId__c", sfdcType: SffRelationshipType.SINGLE, sffBuilder: competitionBuilder },
      ],
    },
    generator: {
      varName: x => `project${x}`,
    },
  },
  ({ fields, relationships, instanceName }) => [
    {
      code: `
Acc_Project__c ${instanceName} = new Acc_Project__c();
${injectRelationshipToApex(instanceName, "Acc_CompetitionId__c", relationships.Acc_CompetitionId__c)}
${injectFieldToApex(instanceName, "Acc_StartDate__c", fields.Acc_StartDate__c)}
${injectFieldToApex(instanceName, "Acc_Duration__c", fields.Acc_Duration__c)}
${injectFieldToApex(instanceName, "Acc_ClaimFrequency__c", fields.Acc_ClaimFrequency__c)}
${injectFieldToApex(instanceName, "Acc_ProjectTitle__c", fields.Acc_ProjectTitle__c)}
${injectFieldToApex(instanceName, "Acc_TSBProjectNumber__c", fields.Acc_TSBProjectNumber__c)}
${injectFieldToApex(instanceName, "Acc_WorkdayProjectSetupComplete__c", fields.Acc_WorkdayProjectSetupComplete__c)}
insert ${instanceName};
        `,
      priority: AccOrder.ACC_PROJECT_LOAD,
    },
    {
      code: `
${injectFieldToApex(instanceName, "Acc_NonFEC__c", fields.Acc_NonFEC__c)}
${injectFieldToApex(instanceName, "Acc_MonitoringLevel__c", fields.Acc_MonitoringLevel__c)}
${injectFieldToApex(instanceName, "Acc_MonitoringReportSchedule__c", fields.Acc_MonitoringReportSchedule__c)}
${injectFieldToApex(instanceName, "Acc_ProjectStatus__c", fields.Acc_ProjectStatus__c)}
upsert ${instanceName};
        `,
      priority: AccOrder.ACC_PROJECT_POSTLOAD,
    },
  ],
);

export { accProjectBuilder };
