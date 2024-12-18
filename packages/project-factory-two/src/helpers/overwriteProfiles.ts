import { Acc_Profile__c } from "../sobjects/Acc_Profile__c";
import { RecordType } from "../sobjects/RecordType";
import { CostCategoryDescription } from "../types/CostCategoryDescription";

interface ProfileDetailInfo {
  latestForecastCost: number;
}

interface ProfileCostCatInfo {
  costCategoryGolCost: number;
  detail: ProfileDetailInfo | ProfileDetailInfo[];
}

interface ProfileCostCatOverride extends ProfileCostCatInfo {
  costCategoryDescription: CostCategoryDescription;
}

const overwriteProfiles = ({
  profiles,
  profileOverrides,
  profileTotalCostCategoryRecordType,
  profileProfileDetailRecordType,
  defaultValues,
}: {
  profiles: Acc_Profile__c[];
  profileOverrides: ProfileCostCatOverride[];
  profileTotalCostCategoryRecordType: RecordType;
  profileProfileDetailRecordType: RecordType;
  defaultValues?: ProfileCostCatInfo;
}) => {
  const updates: Acc_Profile__c[] = [];

  // For each cost category we wish to override...

  for (const profile of profiles) {
    const override =
      profileOverrides.find(x => x.costCategoryDescription === profile.Acc_CostCategoryDescription__c) || defaultValues;

    if (override) {
      switch (profile.RecordTypeId) {
        case profileTotalCostCategoryRecordType.Id:
          profile.Acc_CostCategoryGOLCost__c = override.costCategoryGolCost;
          updates.push(profile);
          break;
        case profileProfileDetailRecordType.Id:
          const detailOverride = Array.isArray(override.detail)
            ? override.detail[(profile.Acc_ProjectPeriodNumber__c as number) - 1]
            : override.detail;

          if (detailOverride) {
            profile.Acc_LatestForecastCost__c = detailOverride.latestForecastCost;
          }

          updates.push(profile);
          break;
      }
    }
  }

  return updates;
};

export { ProfileCostCatInfo as ProfileOverride, overwriteProfiles };
