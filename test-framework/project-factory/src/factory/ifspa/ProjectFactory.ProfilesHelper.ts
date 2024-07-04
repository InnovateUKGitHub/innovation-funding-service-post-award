import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accProjectParticipantBuilder } from "./Acc_ProjectParticipant__c";
import { competitionBuilder } from "./Competition__c";

const projectFactoryProfilesHelperBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "ProjectFactory_ProfilesHelper",
      fields: [
        {
          sfdcName: "ProjectFactory_NumberOfPeriods",
          nullable: false,
          sfdcType: ProjectFactoryFieldType.NUMBER,
        },
      ],
      relationships: [
        {
          sfdcName: "ProjectFactory_ProjectParticipant",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accProjectParticipantBuilder,
          required: true,
        },
        {
          sfdcName: "ProjectFactory_Competition",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: competitionBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `allProfiles${x}`,
    },
  },
  ({ fields, relationships, instanceName }) => {
    const competitionInstanceName = relationships.ProjectFactory_Competition.value.instanceName;
    const participantInstanceName = relationships.ProjectFactory_ProjectParticipant.value.instanceName;
    const numberOfPeriods = fields.ProjectFactory_NumberOfPeriods.value;

    return [
      {
        code: `
List<Acc_CostCategory__c> ${instanceName}CostCategoriesList = [
  SELECT
    Id,
    Acc_CompetitionType__c,
    Acc_CostCategoryName__c,
    Acc_OrganisationType__c
  FROM
    Acc_CostCategory__c
  WHERE
    Acc_CompetitionType__c = :${competitionInstanceName}.Acc_CompetitionType__c AND
    Acc_OrganisationType__c = :${participantInstanceName}.Acc_OrganisationType__c
];
List<Acc_Profile__c> ${instanceName}DetailList = new List<Acc_Profile__c>();
List<Acc_Profile__c> ${instanceName}CostCatList = new List<Acc_Profile__c>();
List<Acc_Profile__c> ${instanceName}EmptyList = new List<Acc_Profile__c>();
public class CannotFindProfileException extends Exception {}

for(Acc_CostCategory__c costCategory : ${instanceName}CostCategoriesList){
  Acc_Profile__c profileCostCategory = new Acc_Profile__c();
  profileCostCategory.Acc_InitialForecastCost__c = 0;
  profileCostCategory.Acc_LatestForecastCost__c = 0;
  profileCostCategory.Acc_ProjectParticipant__c = ${participantInstanceName}.Id;
  profileCostCategory.Acc_ProjectParticipant__r = ${participantInstanceName};
  profileCostCategory.Acc_CostCategory__c = costCategory.Id;
  profileCostCategory.Acc_CostCategory__r = costCategory;
  profileCostCategory.RecordTypeId = Schema.SObjectType.Acc_Profile__c.getRecordTypeInfosByName().get('Total Cost Category').getRecordTypeId();
  ${instanceName}CostCatList.add(profileCostCategory);

  for(Integer i = 0; i < ${numberOfPeriods}; i++){
    Acc_Profile__c profileDetail = new Acc_Profile__c();
    profileDetail.Acc_ProjectPeriodNumber__c = i + 1;
    profileDetail.Acc_InitialForecastCost__c = 0;
    profileDetail.Acc_LatestForecastCost__c = 0;
    profileDetail.Acc_ProjectParticipant__c = ${participantInstanceName}.Id;
    profileDetail.Acc_ProjectParticipant__r = ${participantInstanceName};
    profileDetail.Acc_CostCategory__c = costCategory.Id;
    profileDetail.Acc_CostCategory__r = costCategory;
    profileDetail.RecordTypeId = Schema.SObjectType.Acc_Profile__c.getRecordTypeInfosByName().get('Profile Detail').getRecordTypeId();
    ${instanceName}DetailList.add(profileDetail);
  }
}

Acc_CreateProfileProcessor ${instanceName}createProfileProcessor = new Acc_CreateProfileProcessor();
List<Acc_Profile__c> ${instanceName}ProjectPeriodList = ${instanceName}createProfileProcessor.runTotalProjectPeriodCreationProcess(${instanceName}DetailList, ${instanceName}EmptyList);

Acc_Profile__c ${instanceName}CostCategory(String costCategory) {
  for (Acc_Profile__c profile : ${instanceName}CostCatList) {
    if (profile.Acc_CostCategory__r.Acc_CostCategoryName__c == costCategory) {
      return profile;
    }
  }

  throw new CannotFindProfileException('Cannot find Profile Cost Category for ' + costCategory + ' in the list of ' + ${instanceName}CostCatList.size() + ' profiles.');
}

Acc_Profile__c ${instanceName}ProfileDetail(String costCategory, Integer periodId) {
  for (Acc_Profile__c profile : ${instanceName}DetailList) {
    if (
      profile.Acc_CostCategory__r.Acc_CostCategoryName__c == costCategory &&
      profile.Acc_ProjectPeriodNumber__c == periodId
    ) {
      return profile;
    }
  }

  throw new CannotFindProfileException('Cannot find Profile Detail for ' + costCategory + ' period ' + periodId + ' in the list of ' + ${instanceName}DetailList.size() + ' profiles.');
}
        `,
        priority: ProjectFactoryApexInjectionOrder.ACC_PROFILE_FETCH,
      },
      {
        code: `
ProfileTriggerHandler.isTriggerDisabled = TRUE;
List<Acc_Profile__c> ${instanceName}CombinedList = new List<Acc_Profile__c>();
${instanceName}CombinedList.addAll(${instanceName}CostCatList);
${instanceName}CombinedList.addAll(${instanceName}ProjectPeriodList);
${instanceName}CombinedList.addAll(${instanceName}DetailList);
insert ${instanceName}CombinedList;
        `,
        priority: ProjectFactoryApexInjectionOrder.ACC_PROFILE_LOAD,
      },
    ];
  },
);

export { projectFactoryProfilesHelperBuilder };
