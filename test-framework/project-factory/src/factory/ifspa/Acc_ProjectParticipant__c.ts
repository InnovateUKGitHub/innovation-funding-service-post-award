import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accProjectBuilder } from "./Acc_Project__c";
import { accountBuilder } from "./Account";

const accProjectParticipantBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Acc_ProjectParticipant__c",
      fields: [
        {
          sfdcName: "ParticipantMigrationID__c",
          sfdcType: ProjectFactoryFieldType.STRING,
          nullable: false,
          prefixed: true,
        },
        {
          sfdcName: "Acc_ParticipantType__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: [
            "Business",
            "Knowledge base",
            "Research",
            "Research and Technology Organisation (RTO)",
            "Public sector, charity or non Je-S registered research organisation",
          ],
          nullable: false,
        },
        {
          sfdcName: "Acc_ParticipantSize__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: ["Small", "Medium", "Large", "Academic", "Unknown", "Micro", "Small1"],
          nullable: false,
        },
        {
          sfdcName: "Acc_ProjectRole__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: ["Collaborator", "Lead"],
          nullable: false,
        },
        {
          sfdcName: "Acc_AuditReportFrequency__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: [
            "Never, for this project",
            "With all claims",
            "With the first and last claim only",
            "With the last claim only",
            "With the first claim, last claim and on every anniversary of the project start date",
            "Quarterly",
          ],
          nullable: false,
        },
        {
          sfdcName: "Acc_ParticipantStatus__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: [
            "Pending",
            "Active",
            "On Hold",
            "Invuluntary Withdrawal",
            "Voluntary Withdrawal",
            "Migrated - Withdrawn",
            "Closed",
          ],
          nullable: false,
        },
        { sfdcName: "Acc_Award_Rate__c", sfdcType: ProjectFactoryFieldType.NUMBER, nullable: false },
        { sfdcName: "Acc_Cap_Limit__c", sfdcType: ProjectFactoryFieldType.NUMBER, nullable: false },
        { sfdcName: "Acc_FlaggedParticipant__c", sfdcType: ProjectFactoryFieldType.CHECKBOX, nullable: false },
        { sfdcName: "Acc_OverheadRate__c", sfdcType: ProjectFactoryFieldType.NUMBER, nullable: false },
        {
          sfdcName: "Acc_ParticipantProjectReportingType__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: ["Public", "Private"],
          nullable: false,
        },
        {
          sfdcName: "Acc_OrganisationType__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          values: ["Industrial", "Academic"],
          nullable: false,
        },
        { sfdcName: "Acc_CreateProfiles__c", sfdcType: ProjectFactoryFieldType.CHECKBOX, nullable: false },
        { sfdcName: "Acc_CreateClaims__c", sfdcType: ProjectFactoryFieldType.CHECKBOX, nullable: false },
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
      ],
    },
    generator: {
      varName: x => `projectParticipant${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Acc_ProjectParticipant__c ${instanceName} = new Acc_ProjectParticipant__c();
${injectFieldsToApex(options, instanceName, fields)}
${injectRelationshipToApex(instanceName, "Acc_ProjectId__c", relationships.Acc_ProjectId__c)}
${injectRelationshipToApex(instanceName, "Acc_AccountId__c", relationships.Acc_AccountId__c)}
insert ${instanceName};
      `,
      priority: ProjectFactoryApexInjectionOrder.ACC_PROJECT_PARTICIPANT_LOAD,
    },
  ],
);

const defaultAccProjectParticipant = accProjectParticipantBuilder
  .new()
  .set({
    ParticipantMigrationID__c: "004001",
    Acc_ParticipantType__c: "Business",
    Acc_ParticipantSize__c: "Medium",
    Acc_ProjectRole__c: "Lead",
    Acc_AuditReportFrequency__c: "With all claims",
    Acc_ParticipantStatus__c: "Active",
    Acc_Award_Rate__c: 50,
    Acc_Cap_Limit__c: 50,
    Acc_FlaggedParticipant__c: false,
    Acc_OverheadRate__c: 20,
    Acc_ParticipantProjectReportingType__c: "Public",
    Acc_OrganisationType__c: "Industrial",
    Acc_CreateProfiles__c: false,
    Acc_CreateClaims__c: false,
  })
  .copy();

export { accProjectParticipantBuilder, defaultAccProjectParticipant };
