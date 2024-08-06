import { PCRItemType } from "@framework/constants/pcrConstants";
import { createContext, useContext } from "react";

export type RecordType = {
  id: string;
  parent: string;
  type: string;
};

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

export class RecordTypeProvider {
  public recordTypes: RecordType[] = [];
  constructor(recordTypes: RecordType[]) {
    this.recordTypes = recordTypes;
    this.getRecordType = this.getRecordType.bind(this);
    this.getPcrRecordIdFromItemType = this.getPcrRecordIdFromItemType.bind(this);
    this.getPcrSpendProfileRecordType = this.getPcrSpendProfileRecordType.bind(this);
  }

  getRecordType(type: string, parent: string): RecordType {
    const record = this.recordTypes.find(x => x.parent === parent && x.type === type);
    if (!record) {
      throw new Error("Unable to find a matching record for parent and type " + parent + " " + type);
    }
    return record;
  }

  getPcrRecordIdFromItemType(pcrItemType: PCRItemType) {
    const pcrTypeName = getPcrTypeNameFromItemType(pcrItemType);
    const recordType = this.getRecordType(pcrTypeName, "Acc_ProjectChangeRequest__c");
    if (!recordType) {
      throw new Error("cannot find matching record type for pcrItemType " + pcrItemType);
    }
    return recordType.id;
  }

  getPcrSpendProfileRecordType() {
    return this.getRecordType("PCR Spend Profile", "Acc_IFSSpendProfile__c").id;
  }
}

const recordTypesContext = createContext<RecordTypeProvider>(new RecordTypeProvider([]));
export const RecordTypesContextProvider = recordTypesContext.Provider;
export const useRecordTypesContext = () => useContext(recordTypesContext);
