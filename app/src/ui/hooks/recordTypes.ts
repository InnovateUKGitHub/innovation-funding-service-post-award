import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { recordTypesQuery } from "./RecordTypesQuery";
import { RecordTypesQuery } from "./__generated__/RecordTypesQuery.graphql";
import { PCRItemType } from "@framework/constants/pcrConstants";

type RecordType = {
  id: string;
  parent: string;
  type: string;
};

type Node =
  | {
      Id: string;
      Name: GQL.Value<string>;
      SobjectType: GQL.Value<string>;
    }
  | null
  | undefined;

const mapRecordTypes = (node: Node): RecordType => ({
  id: node?.Id ?? "unknown",
  parent: node?.SobjectType?.value ?? "unknown",
  type: node?.Name?.value ?? "unknown",
});

const getPcrTypeNameFromItemType = (pcrItemType: PCRItemType) => {
  switch (pcrItemType) {
    case PCRItemType.AccountNameChange:
      return "Change a partner's name";
    case PCRItemType.PartnerAddition:
      return "Add a partner";
    case PCRItemType.PartnerWithdrawal:
      return "Remove a partner";
    case PCRItemType.ProjectSuspension:
      return "Project Suspension";
    case PCRItemType.ProjectTermination:
      return "Project Termination";
    case PCRItemType.MultiplePartnerFinancialVirement:
      return "Reallocate several partners' project cost";
    case PCRItemType.ScopeChange:
      return "Change project scope";
    case PCRItemType.TimeExtension:
      return "Change project duration";
    case PCRItemType.PeriodLengthChange:
      return "Change period length";
    case PCRItemType.LoanDrawdownChange:
      return "Loan Drawdown Change";
    case PCRItemType.LoanDrawdownExtension:
      return "Change Loans Duration";
    case PCRItemType.ApproveNewSubcontractor:
      return "Approve a new subcontractor";
    case PCRItemType.Uplift:
      return "Uplift";
    default:
      throw new Error("No matching type for the item enum");
  }
};

export const useRecordTypes = () => {
  const { data, isLoading } = useQuery<RecordTypesQuery>(recordTypesQuery);

  const recordTypes = (data?.salesforce?.uiapi?.query?.RecordType?.edges ?? []).map(x => mapRecordTypes(x?.node));

  const getRecordType = (type: string, parent: string) => {
    const record = recordTypes.find(x => x.parent === parent && x.type === type);
    if (!record) {
      throw new Error("Unable to find a matching record for parent and type " + parent + " " + type);
    }
    return record.id;
  };

  const getPcrRecordIdFromItemType = (pcrItemType: PCRItemType) => {
    return getRecordType(getPcrTypeNameFromItemType(pcrItemType), "Acc_ProjectChangeRequest__c");
  };

  const getPcrSpendProfileRecordType = () => getRecordType("PCR Spend Profile", "Acc_IFSSpendProfile__c");

  return {
    recordTypes,
    isLoading,
    getPcrTypeNameFromItemType,
    getRecordType,
    getPcrRecordIdFromItemType,
    getPcrSpendProfileRecordType,
  };
};
