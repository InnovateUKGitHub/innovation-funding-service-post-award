import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldToApex, injectRecordTypeId, injectRelationshipToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accPcrHeaderBuilder } from "./Acc_ProjectChangeRequest__c.RequestHeader";
import { accProjectParticipantBuilder } from "./Acc_ProjectParticipant__c";
import { accProjectBuilder } from "./Acc_Project__c";

const accPcrRemovePartnerBuilder = new ProjectFactory(
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
          sfdcName: "Acc_RemovalPeriod__c",
          sfdcType: ProjectFactoryFieldType.NUMBER,
          nullable: true,
        },
      ],
      relationships: [
        {
          sfdcName: "Acc_RequestHeader__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accPcrHeaderBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_Project_Participant__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accProjectParticipantBuilder,
          required: true,
        },
        {
          sfdcName: "Acc_Project__c",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accProjectBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `pcrRemovePartner${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Acc_ProjectChangeRequest__c ${instanceName} = new Acc_ProjectChangeRequest__c();
${injectRecordTypeId(instanceName, "Acc_ProjectChangeRequest__c", "Acc_RemoveAPartner")}
${injectRelationshipToApex(instanceName, "Acc_RequestHeader__c", relationships.Acc_RequestHeader__c)}
${injectRelationshipToApex(instanceName, "Acc_Project_Participant__c", relationships.Acc_Project_Participant__c)}
${injectRelationshipToApex(instanceName, "Acc_Project__c", relationships.Acc_Project__c)}
${injectFieldToApex(options, instanceName, "Acc_MarkedasComplete__c", fields.Acc_MarkedasComplete__c)}
insert ${instanceName};
`,
      priority: ProjectFactoryApexInjectionOrder.ACC_PROJECT_CHANGE_REQUEST_REMOVE_PROJECT_PARTICIPANT,
    },
  ],
);

export { accPcrRemovePartnerBuilder };
