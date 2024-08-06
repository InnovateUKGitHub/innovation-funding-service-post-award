// import { PCRItemType } from "@framework/constants/pcrConstants";

// export const recordTypes = [
//   {
//     id: "01226000002ZVmBAAW",
//     parent: "Knowledge__kav",
//     type: "Competition Guideline",
//   },
//   { id: "01226000002ZVmCAAW", parent: "Knowledge__kav", type: "FAQ" },
//   {
//     id: "01226000002ZVmDAAW",
//     parent: "Knowledge__kav",
//     type: "How to",
//   },
//   {
//     id: "01226000002ZVmEAAW",
//     parent: "Knowledge__kav",
//     type: "Troubleshooting",
//   },
//   {
//     id: "0124I0000002ae1QAA",
//     parent: "Business_Case__c",
//     type: "Standard",
//   },
//   { id: "0124I0000002ae2QAA", parent: "Task", type: "PA_Tasks" },
//   {
//     id: "0124I0000002ajBQAQ",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Loan Drawdown Change",
//   },
//   {
//     id: "0124I0000002ajCQAQ",
//     parent: "Acc_Virements__c",
//     type: "Participant Virement for Loan Drawdown",
//   },
//   {
//     id: "0124I0000002ajDQAQ",
//     parent: "Acc_Virements__c",
//     type: "Period Virement for Loan Drawdown",
//   },
//   { id: "0124I0000002ajEQAQ", parent: "Task", type: "Loans" },
//   {
//     id: "0124I0000002ajuQAA",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Change Loans Duration",
//   },
//   { id: "0124I000000Az0EQAS", parent: "Bids__c", type: "In Progress" },
//   {
//     id: "0124I000000Az0FQAS",
//     parent: "Bids__c",
//     type: "Offer - Not progressing",
//   },
//   {
//     id: "0124I000000Az0GQAS",
//     parent: "Bids__c",
//     type: "Offer accepted",
//   },
//   { id: "0124I000000Az0HQAS", parent: "Bids__c", type: "Pre-Offer" },
//   { id: "0124I000000Az0IQAS", parent: "Bids__c", type: "Unsuccessful" },
//   {
//     id: "0124I000000FZHUQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Account Name Change",
//   },
//   {
//     id: "0124I000000FZHVQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Multiple Partner Financial Virement",
//   },
//   {
//     id: "0124I000000FZHWQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Partner Addition",
//   },
//   {
//     id: "0124I000000FZHXQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Partner Withdrawal",
//   },
//   {
//     id: "0124I000000FZHYQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Project Suspension",
//   },
//   {
//     id: "0124I000000FZHZQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Project Termination",
//   },
//   {
//     id: "0124I000000FZHaQAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Request Header",
//   },
//   {
//     id: "0124I000000FZHbQAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Scope Change",
//   },
//   {
//     id: "0124I000000FZHcQAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Single Partner Financial Virement",
//   },
//   {
//     id: "0124I000000FZHdQAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Time Extension",
//   },
//   {
//     id: "0124I000000FZO6QAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Add a partner",
//   },
//   {
//     id: "0124I000000FZO7QAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Between Partner Financial Virement",
//   },
//   {
//     id: "0124I000000FZO8QAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Change a partner's name",
//   },
//   {
//     id: "0124I000000FZO9QAO",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Change project duration",
//   },
//   {
//     id: "0124I000000FZOAQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Change project scope",
//   },
//   {
//     id: "0124I000000FZOBQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "End the project early",
//   },
//   {
//     id: "0124I000000FZOCQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Financial Virement",
//   },
//   {
//     id: "0124I000000FZODQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Put project on hold",
//   },
//   {
//     id: "0124I000000FZOEQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Reallocate one partner's project costs",
//   },
//   {
//     id: "0124I000000FZOFQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Reallocate several partners' project cost",
//   },
//   {
//     id: "0124I000000FZOGQA4",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Remove a partner",
//   },
//   {
//     id: "0124I000000FZOHQA4",
//     parent: "Task",
//     type: "Project Change Requests",
//   },
//   { id: "0124I000000FZOIQA4", parent: "Task", type: "Task" },
//   {
//     id: "0124I000000FZduQAG",
//     parent: "Acc_Virements__c",
//     type: "Virements for Costs",
//   },
//   {
//     id: "0124I000000FZdvQAG",
//     parent: "Acc_Virements__c",
//     type: "Virements for Participant",
//   },
//   { id: "0124I000000FZxuQAG", parent: "Task", type: "General" },
//   { id: "0124I000000FZxvQAG", parent: "Task", type: "Insights" },
//   {
//     id: "0124I000000FZzbQAG",
//     parent: "Acc_IFSSpendProfile__c",
//     type: "IFS Spend Profile",
//   },
//   {
//     id: "0124I000000FZzcQAG",
//     parent: "Acc_IFSSpendProfile__c",
//     type: "PCR Spend Profile",
//   },
//   {
//     id: "0124I000000Fa6SQAS",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Change period length",
//   },
//   { id: "0124I000000FaCVQA0", parent: "Case", type: "UKRI" },
//   { id: "0124I000000FaCzQAK", parent: "Case", type: "Innovate UK" },
//   {
//     id: "0124I000000FaHpQAK",
//     parent: "Case",
//     type: "Salesforce Support",
//   },
//   {
//     id: "0124I000000cxupQAA",
//     parent: "Acc_Claims__c",
//     type: "Claims Detail",
//   },
//   {
//     id: "0124I000000cxuqQAA",
//     parent: "Acc_Claims__c",
//     type: "Claims Line Item",
//   },
//   {
//     id: "0124I000000cxurQAA",
//     parent: "Acc_Claims__c",
//     type: "Total Cost Category",
//   },
//   {
//     id: "0124I000000cxusQAA",
//     parent: "Acc_Claims__c",
//     type: "Total Project Period",
//   },
//   {
//     id: "0124I000000cxv0QAA",
//     parent: "Acc_Profile__c",
//     type: "Profile Detail",
//   },
//   {
//     id: "0124I000000cxv1QAA",
//     parent: "Acc_Profile__c",
//     type: "Total Cost Category",
//   },
//   {
//     id: "0124I000000cxv2QAA",
//     parent: "Acc_Profile__c",
//     type: "Total Project Period",
//   },
//   {
//     id: "0124I000000h9luQAA",
//     parent: "Acc_MonitoringAnswer__c",
//     type: "Monitoring Answer",
//   },
//   {
//     id: "0124I000000h9lvQAA",
//     parent: "Acc_MonitoringAnswer__c",
//     type: "Monitoring Header",
//   },
//   { id: "01258000000TcoEAAS", parent: "Account", type: "Organisation" },
//   {
//     id: "01258000000TcoiAAC",
//     parent: "Account",
//     type: "Person Account",
//   },
//   { id: "012Ad000000OS3BIAW", parent: "Case", type: "Web to Case" },
//   {
//     id: "012Ad000000OS4nIAG",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Approve a new subcontractor",
//   },
//   {
//     id: "012Ad000000P8gjIAC",
//     parent: "Acc_ProjectChangeRequest__c",
//     type: "Uplift",
//   },
//   {
//     id: "012Ad000000yWUrIAM",
//     parent: "Assurance_Insights__c",
//     type: "Watchlist",
//   },
//   {
//     id: "012Ad000000yWUsIAM",
//     parent: "IM_Survey_Template__c",
//     type: "IM Survey",
//   },
//   {
//     id: "012Ad000000yWUtIAM",
//     parent: "IM_Survey_Template__c",
//     type: "KTP Survey",
//   },
// ] as const;

// type RecordType = (typeof recordTypes)[number]["type"];
// type ParentRecordType = (typeof recordTypes)[number]["parent"];

// export const getRecordTypeIdFromType = (type: RecordType) => {
//   const record = recordTypes.find(x => x.type === type);
//   if (!record) {
//     throw new Error("Unable to find a matching record for id: " + type);
//   }
//   return record.id;
// };

// export const getRecordTypeIdFromParent = (parent: ParentRecordType) => {
//   const record = recordTypes.find(x => x.parent === parent);
//   if (!record) {
//     throw new Error("Unable to find a matching record for parent id: " + parent);
//   }
//   return record.id;
// };

// export const getRecordType = (type: RecordType, parent: ParentRecordType) => {
//   const record = recordTypes.find(x => x.parent === parent && x.type === type);
//   if (!record) {
//     throw new Error("Unable to find a matching record for parent and type " + parent + " " + type);
//   }
//   return record.id;
// };

// export const getPcrTypeNameFromItemType = (pcrItemType: PCRItemType) => {
//   switch (pcrItemType) {
//     case PCRItemType.AccountNameChange:
//       return "Change a partner's name";
//     case PCRItemType.PartnerAddition:
//       return "Add a partner";
//     case PCRItemType.PartnerWithdrawal:
//       return "Remove a partner";
//     case PCRItemType.ProjectSuspension:
//       return "Project Suspension";
//     case PCRItemType.ProjectTermination:
//       return "Project Termination";
//     case PCRItemType.MultiplePartnerFinancialVirement:
//       return "Reallocate several partners' project cost";
//     case PCRItemType.ScopeChange:
//       return "Change project scope";
//     case PCRItemType.TimeExtension:
//       return "Change project duration";
//     case PCRItemType.PeriodLengthChange:
//       return "Change period length";
//     case PCRItemType.LoanDrawdownChange:
//       return "Loan Drawdown Change";
//     case PCRItemType.LoanDrawdownExtension:
//       return "Change Loans Duration";
//     case PCRItemType.ApproveNewSubcontractor:
//       return "Approve a new subcontractor";
//     case PCRItemType.Uplift:
//       return "Uplift";
//     default:
//       throw new Error("No matching type for the item enum");
//   }
// };

// export const getPcrRecordIdFromItemType = (pcrItemType: PCRItemType) =>
//   getRecordType(getPcrTypeNameFromItemType(pcrItemType), "Acc_ProjectChangeRequest__c");

// export const getPcrSpendProfileRecordType = () => getRecordType("PCR Spend Profile", "Acc_IFSSpendProfile__c");
