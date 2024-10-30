import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldToApex, injectRecordTypeId, injectRelationshipToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accProjectBuilder } from "./Acc_Project__c";

const accPcrHeaderBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Acc_ProjectChangeRequest__c",
      fields: [
        {
          sfdcName: "Acc_MarkedasComplete__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          nullable: false,
          values: ["To Do", "Incomplete", "Complete"],
        },
        {
          sfdcName: "Acc_Status__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          nullable: false,
          values: [
            "Draft",
            "Submitted to Monitoring Officer",
            "Queried by Monitoring Officer",
            "Submitted to Innovate UK",
            "Queried by Innovation Lead",
            "Withdrawn",
            "Rejected",
            "Awaiting Amendment Letter",
            "Approved",
            "Submitted to Innovation Lead",
            "Queried by Innovate UK",
            "In Review with Project Finance",
            "In External Review",
            "In Review with Innovate UK",
            "Actioned",
          ],
        },
        {
          sfdcName: "Acc_RequestNumber__c",
          sfdcType: ProjectFactoryFieldType.NUMBER,
          nullable: true,
        },
      ],
      relationships: [
        {
          sfdcName: "Acc_Project__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accProjectBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `pcrHeader${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Acc_ProjectChangeRequest__c ${instanceName} = new Acc_ProjectChangeRequest__c();
${injectRecordTypeId(instanceName, "Acc_ProjectChangeRequest__c", "Acc_RequestHeader")}
${injectRelationshipToApex(instanceName, "Acc_Project__c", relationships.Acc_Project__c)}
${injectFieldToApex(options, instanceName, "Acc_Status__c", fields.Acc_Status__c)}
${injectFieldToApex(options, instanceName, "Acc_MarkedasComplete__c", fields.Acc_MarkedasComplete__c)}
insert ${instanceName};
`,
      priority: ProjectFactoryApexInjectionOrder.ACC_PROJECT_CHANGE_REQUEST_REQUEST_HEADER,
    },
  ],
);

export { accPcrHeaderBuilder };
