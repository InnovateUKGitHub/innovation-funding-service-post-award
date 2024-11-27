import { Trigger__mdt } from "../sobjects/Trigger__mdt";

const useTriggerMdt = ({ triggers }: { triggers: Trigger__mdt[] }) => {
  const claimTrigger = triggers.find(x => x.DeveloperName === "ClaimTrigger");
  const profileTrigger = triggers.find(x => x.DeveloperName === "ProfileTrigger");

  if (!claimTrigger || !profileTrigger) throw new Error("Missing Trigger__mdt values in Salesforce");

  const setTrigger = (trigger: Trigger__mdt, disabled: boolean) => {
    trigger.IsDisabled__c = disabled;
  };

  return {
    disableClaimTrigger: () => setTrigger(claimTrigger, true),
    enableClaimTrigger: () => setTrigger(claimTrigger, false),
    disableProfileTrigger: () => setTrigger(profileTrigger, true),
    enableProfileTrigger: () => setTrigger(profileTrigger, false),
  };
};

export { useTriggerMdt };
