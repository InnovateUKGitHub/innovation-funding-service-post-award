import { ProjectFactoryDatabaseIdMissingException } from "../exceptions/ProjectFactoryDatabaseIdMissingException";
import { Acc_Claims__c } from "../sobjects/Acc_Claims__c";
import { Acc_Profile__c } from "../sobjects/Acc_Profile__c";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { RecordType } from "../sobjects/RecordType";
import { ClaimStatus } from "../types/ClaimStatus";
import { CostCategoryDescription } from "../types/CostCategoryDescription";

interface ClaimLineItemInfo {
  name: string;
  value: number;
}

interface ClaimDetailInfo {
  costCategory: CostCategoryDescription;
  claimLineItems: ClaimLineItemInfo[];
}

interface ClaimPeriodInfo {
  period: number;
  claimStatus: ClaimStatus;
  claimDetails: ClaimDetailInfo[];
  finalClaim: boolean;
}

const makeClaims = ({
  recordTypes,
  projectParticipant,
  project,
  profiles = [],
  claimTotalProjectPeriods: existingClaimTotalProjectPeriods = [],
  claimOverrides = [],
}: {
  recordTypes: RecordType[];
  projectParticipant: Acc_ProjectParticipant__c;
  project: Acc_Project__c;
  profiles?: Acc_Profile__c[];
  claimTotalProjectPeriods?: Acc_Claims__c[];
  claimOverrides?: ClaimPeriodInfo[];
}) => {
  const duration = project.Acc_Duration__c;
  if (typeof duration !== "number") throw new Error("duration must be a number");
  const numberOfPeriods = project.Acc_ClaimFrequency__c === "Monthly" ? duration : Math.round(duration / 3);

  const claimTotalProjectPeriodRecordType = recordTypes.find(
    x => x.SobjectType === "Acc_Claims__c" && x.DeveloperName === "Total_Project_Period",
  );
  const claimDetailRecordType = recordTypes.find(
    x => x.SobjectType === "Acc_Claims__c" && x.DeveloperName === "Claims_Detail",
  );
  const claimLineItemRecordType = recordTypes.find(
    x => x.SobjectType === "Acc_Claims__c" && x.DeveloperName === "Claims_Line_Item",
  );

  if (!claimTotalProjectPeriodRecordType) throw new Error("Missing 'total project period' record type for claims.");
  if (!claimDetailRecordType) throw new Error("Missing 'claim details' record type for claims.");
  if (!claimLineItemRecordType) throw new Error("Missing 'claim line item' record type for claims.");

  const claimTotalProjectPeriods: Acc_Claims__c[] = [];
  const claimDetails: Acc_Claims__c[] = [];
  const claimLineItems: Acc_Claims__c[] = [];

  for (let i = 1; i <= numberOfPeriods; i++) {
    const claimOverride = claimOverrides.find(x => x.period === i);
    const existingClaim = existingClaimTotalProjectPeriods.find(
      x => x.Acc_ProjectPeriodNumber__c === i && x.Acc_ProjectParticipant__c === projectParticipant.Id,
    );

    const claim = existingClaim || new Acc_Claims__c();
    claim.Acc_ProjectPeriodNumber__c = i;
    claim.Acc_ProjectParticipant__c = projectParticipant.Id;
    claim.RecordTypeId = claimTotalProjectPeriodRecordType.Id;

    if (claimOverride) {
      claim.Acc_ClaimStatus__c = claimOverride.claimStatus;
      claim.Acc_FinalClaim__c = claimOverride.finalClaim;

      for (const claimDetailInfo of claimOverride.claimDetails) {
        const costCategory = profiles.find(
          x => x.Acc_CostCategoryDescription__c === claimDetailInfo.costCategory,
        )?.Acc_CostCategory__c;
        if (!costCategory)
          throw new ProjectFactoryDatabaseIdMissingException(
            `Could not find cost category id for cost cat ${claimDetailInfo.costCategory}`,
          );

        const claimDetail = new Acc_Claims__c();
        claimDetail.Acc_ProjectPeriodNumber__c = i;
        claimDetail.Acc_ProjectParticipant__c = projectParticipant.Id;
        claimDetail.Acc_CostCategory__c = costCategory;
        claimDetail.RecordTypeId = claimDetailRecordType.Id;
        claimDetail.Acc_ParentId__c = () => claim.Id;
        claimDetails.push(claimDetail);

        for (const claimLineItemInfo of claimDetailInfo.claimLineItems) {
          const claimLineItem = new Acc_Claims__c();
          claimLineItem.Acc_ProjectPeriodNumber__c = i;
          claimLineItem.Acc_ProjectParticipant__c = projectParticipant.Id;
          claimLineItem.Acc_CostCategory__c = costCategory;
          claimLineItem.RecordTypeId = claimLineItemRecordType.Id;
          claimLineItem.Acc_LineItemCost__c = claimLineItemInfo.value;
          claimLineItem.Acc_LineItemDescription__c = claimLineItemInfo.name;
          claimLineItem.Acc_ParentId__c = () => claimDetail.Id;
          claimLineItems.push(claimLineItem);
        }
      }
    } else if (claimOverrides.length === 0) {
      claim.Acc_ClaimStatus__c = i === 1 ? "Draft" : "New";
    } else {
      claim.Acc_ClaimStatus__c = "New";
    }

    claimTotalProjectPeriods.push(claim);
  }

  return {
    claimTotalProjectPeriods,
    claimDetails,
    claimLineItems,
  };
};

export { makeClaims };
export type { ClaimPeriodInfo };
