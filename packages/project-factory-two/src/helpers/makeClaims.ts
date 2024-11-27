import { Acc_Claims__c } from "../sobjects/Acc_Claims__c";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { RecordType } from "../sobjects/RecordType";

const makeClaims = ({
  recordTypes,
  projectParticipant,
  project,
}: {
  recordTypes: RecordType[];
  projectParticipant: Acc_ProjectParticipant__c;
  project: Acc_Project__c;
}) => {
  const duration = project.Acc_Duration__c;
  if (typeof duration !== "number") throw new Error("duration must be a number");
  const numberOfPeriods = project.Acc_ClaimFrequency__c === "Monthly" ? duration : Math.round(duration / 3);

  const claimTotalProjectPeriodRecordType = recordTypes.find(
    x => x.SobjectType === "Acc_Claims__c" && x.DeveloperName === "Total_Project_Period",
  );
  if (!claimTotalProjectPeriodRecordType) throw new Error("Missing 'total project period' record type for claims.");
  const claimTotalProjectPeriods: Acc_Claims__c[] = [];

  for (let i = 1; i <= numberOfPeriods; i++) {
    const claim = new Acc_Claims__c();
    claim.Acc_ClaimStatus__c = "New";
    claim.Acc_ProjectPeriodNumber__c = i;
    claim.Acc_ProjectParticipant__c = projectParticipant.Id;
    claim.RecordTypeId = claimTotalProjectPeriodRecordType.Id;
    claimTotalProjectPeriods.push(claim);
  }

  return {
    claimTotalProjectPeriods,
  };
};

export { makeClaims };
