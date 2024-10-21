import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accProjectParticipantBuilder } from "./Acc_ProjectParticipant__c";
import { competitionBuilder } from "./Competition__c";

const projectFactoryClaimsAndProfilesHelperBuilder = new ProjectFactory(
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

List<Acc_Profile__c> ${instanceName}ProfileDetailList = new List<Acc_Profile__c>();
List<Acc_Profile__c> ${instanceName}ProfileCostCatList = new List<Acc_Profile__c>();
List<Acc_Profile__c> ${instanceName}ProfileEmptyList = new List<Acc_Profile__c>();
List<Acc_Claims__c> ${instanceName}ClaimProjectPeriodList = new List<Acc_Claims__c>();
Id ${instanceName}ProfileTotalCostCategoryRecordTypeId = Schema.SObjectType.Acc_Profile__c.getRecordTypeInfosByName().get('Total Cost Category').getRecordTypeId();
Id ${instanceName}ProfileDetailRecordTypeId = Schema.SObjectType.Acc_Profile__c.getRecordTypeInfosByName().get('Profile Detail').getRecordTypeId();
Id ${instanceName}ClaimTotalProjectPeriodRecordTypeId = Schema.SObjectType.Acc_Claims__c.getRecordTypeInfosByName().get('Total Project Period').getRecordTypeId();

/**
 * Lookup functions
 * Does not include profile total project periods, as those are created later.
 */
public class ${instanceName}CannotFindClaimOrProfileException extends Exception {}

Acc_Profile__c ${instanceName}ProfileCostCategory(String costCategory) {
  for (Acc_Profile__c profile : ${instanceName}ProfileCostCatList) {
    if (profile.Acc_CostCategory__r.Acc_CostCategoryName__c == costCategory) {
      return profile;
    }
  }

  throw new ${instanceName}CannotFindClaimOrProfileException('Cannot find Profile Cost Category for ' + costCategory + ' in the list of ' + ${instanceName}ProfileCostCatList.size() + ' profiles.');
}

Acc_Profile__c ${instanceName}ProfileDetail(String costCategory, Integer periodId) {
  for (Acc_Profile__c profile : ${instanceName}ProfileDetailList) {
    if (profile.Acc_CostCategory__r.Acc_CostCategoryName__c == costCategory && profile.Acc_ProjectPeriodNumber__c == periodId) {
      return profile;
    }
  }

  throw new ${instanceName}CannotFindClaimOrProfileException('Cannot find Profile Detail for ' + costCategory + ' period ' + periodId + ' in the list of ' + ${instanceName}ProfileDetailList.size() + ' profiles.');
}

for (Integer i = 0; i < ${numberOfPeriods}; i++) {
  Acc_Claims__c totalProjectPeriod = new Acc_Claims__c();
  totalProjectPeriod.Acc_ProjectPeriodNumber__c = i + 1;
  totalProjectPeriod.RecordTypeId = ${instanceName}ClaimTotalProjectPeriodRecordTypeId;
  totalProjectPeriod.Acc_ProjectParticipant__c = ${participantInstanceName}.Id;
  totalProjectPeriod.Acc_ProjectParticipant__r = ${participantInstanceName};
  totalProjectPeriod.Acc_ClaimStatus__c = 'New';
  ${instanceName}ClaimProjectPeriodList.add(totalProjectPeriod);
}

for (Acc_CostCategory__c costCategory : ${instanceName}CostCategoriesList) {
  Acc_Profile__c profileCostCategory = new Acc_Profile__c();
  profileCostCategory.Acc_InitialForecastCost__c = 0;
  profileCostCategory.Acc_LatestForecastCost__c = 0;
  profileCostCategory.Acc_ProjectParticipant__c = ${participantInstanceName}.Id;
  profileCostCategory.Acc_ProjectParticipant__r = ${participantInstanceName};
  profileCostCategory.Acc_CostCategory__c = costCategory.Id;
  profileCostCategory.Acc_CostCategory__r = costCategory;
  profileCostCategory.RecordTypeId = ${instanceName}ProfileTotalCostCategoryRecordTypeId;
  ${instanceName}ProfileCostCatList.add(profileCostCategory);

  for (Integer i = 0; i < ${numberOfPeriods}; i++) {
    Acc_Profile__c profileDetail = new Acc_Profile__c();
    profileDetail.Acc_ProjectPeriodNumber__c = i + 1;
    profileDetail.Acc_InitialForecastCost__c = 0;
    profileDetail.Acc_LatestForecastCost__c = 0;
    profileDetail.Acc_ProjectParticipant__c = ${participantInstanceName}.Id;
    profileDetail.Acc_ProjectParticipant__r = ${participantInstanceName};
    profileDetail.Acc_CostCategory__c = costCategory.Id;
    profileDetail.Acc_CostCategory__r = costCategory;
    profileDetail.RecordTypeId = ${instanceName}ProfileDetailRecordTypeId;
    ${instanceName}ProfileDetailList.add(profileDetail);
  }
}

Acc_CreateProfileProcessor ${instanceName}createProfileProcessor = new Acc_CreateProfileProcessor();
List<Acc_Profile__c> ${instanceName}ProfileProjectPeriodList = ${instanceName}createProfileProcessor.runTotalProjectPeriodCreationProcess(${instanceName}ProfileDetailList, ${instanceName}ProfileEmptyList);

Acc_Claims__c ${instanceName}ClaimProjectPeriod(Integer periodId) {
  for (Acc_Claims__c claim : ${instanceName}ClaimProjectPeriodList) {
    if (claim.Acc_ProjectPeriodNumber__c == periodId) {
      return claim;
    }
  }

  throw new ${instanceName}CannotFindClaimOrProfileException('Cannot find Claim Total Project Period for period ' + periodId + ' in the list of ' + ${instanceName}ClaimProjectPeriodList.size() + ' claims.');
}

Acc_Profile__c ${instanceName}ProfileProjectPeriod(Integer periodId) {
  for (Acc_Profile__c profile : ${instanceName}ProfileProjectPeriodList) {
    if (profile.Acc_ProjectPeriodNumber__c == periodId) {
      return profile;
    }
  }

  throw new ${instanceName}CannotFindClaimOrProfileException('Cannot find Profile Total Project Period for period ' + periodId + ' in the list of ' + ${instanceName}ProfileProjectPeriodList.size() + ' profiles.');
}
        `,
        priority: ProjectFactoryApexInjectionOrder.ACC_CLAIMS_AND_PROFILE_FETCH,
      },
      {
        code: `
ProfileTriggerHandler.isTriggerDisabled = TRUE;
List<Acc_Profile__c> ${instanceName}ProfileCombinedList = new List<Acc_Profile__c>();
${instanceName}ProfileCombinedList.addAll(${instanceName}ProfileCostCatList);
${instanceName}ProfileCombinedList.addAll(${instanceName}ProfileProjectPeriodList);
${instanceName}ProfileCombinedList.addAll(${instanceName}ProfileDetailList);
insert ${instanceName}ProfileCombinedList;
insert ${instanceName}ClaimProjectPeriodList;
        `,
        priority: ProjectFactoryApexInjectionOrder.ACC_CLAIMS_AND_PROFILE_LOAD,
      },
    ];
  },
);

export { projectFactoryClaimsAndProfilesHelperBuilder };
