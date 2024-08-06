const types = [
  "Base64",
  "Boolean",
  "Currency",
  "DateTime",
  "Date",
  "Double",
  "Email",
  "EncryptedString",
  "ID",
  "Id",
  "Int",
  "IdOrRef",
  // "JSON",
  // "Latitude",
  "LongTextArea",
  "Long",
  // "Longitude",
  "MultiPicklist",
  "Percent",
  "PhoneNumber",
  "Picklist",
  "RichTextArea",
  "String",
  "TextArea",
  "Time",
  "Url",
  "Group",
] as const;

const objectsToKeep = [
  "Group",
  "User",
  "RecordQuery",
  "RecordType",
  "ContentDocument",
  "ContentDocumentLink",
  "Acc_ProjectChangeRequest__c",
  "Competition__c",
  "Acc_Claims__c",
  "Acc_StatusChange__c",
  "Acc_CostCategory__c",
  "Acc_Virements__c",
  "Acc_Prepayment__c",
  "Acc_MonitoringQuestion__c",
  "Acc_MonitoringAnswer__c",
  "Acc_ProjectParticipant__c",
  "Acc_IFSSpendProfile",
  "Acc_Profile__c",
  "Acc_ProjectContactLink__c",
  "Acc_Project__c",
  "Acc_BroadcastMessage__c",
  "Acc_IFSSpendProfile__c",
  "Account",
  "Contact",
  "Group",
  "Order",
  "AggregateOrderByStringClause",
  "NoFunctionAggregateOrderByClause",
  "AggregateOrderByNumberClause",
  "UIAPIMutations",
  "UIAPIMutationsInput",
] as const;

const typeSuffixes = ["", "Input", "Value", "Operators", "Aggregate", "Literal"];
const objectSuffixes = [
  "",
  "Node",
  "Edge",
  "Connection",
  "_Filter",
  "_OrderBy",
  "_GroupBy",
  "_Owner",
  "OrderByStringClause",
] as const;

const mutations = [
  "Record",
  "Acc_Project__c",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectChangeRequest__c",
  "Acc_IFSSpendProfile__c",
] as const;

const mutationSuffixes = ["Create", "Delete", "Update"] as const;
const mutationTypes = ["", "Input", "Payload", "Representation"] as const;
const additionalObjects = [
  "Query",
  "UIAPI",
  "Mutation",
  "GroupByDateFunction",
  "GroupByFunction",
  "GroupByClause",
  "GroupByType",
  "GroupEdge",
  "GroupResult",
  "OrderByClause",
  "ResultOrder",
  "NullOrder",
  "ObjectInfo",
  "ResultsOrder",
  "NullsOrder",
] as const;

const getTypeWhitelist = () => {
  const whitelist: string[] = [];

  for (const additionalType of additionalObjects) {
    whitelist.push(additionalType);
  }

  for (const type of types) {
    for (const suffix of typeSuffixes) {
      whitelist.push(`${type}${suffix}`);
    }
  }

  for (const mutation of mutations) {
    for (const suffix of mutationSuffixes) {
      for (const type of mutationTypes) {
        whitelist.push(`${mutation}${suffix}${type}`);
      }
    }
  }

  for (const objectToKeep of objectsToKeep) {
    for (const suffix of objectSuffixes) {
      whitelist.push(`${objectToKeep}${suffix}`);
    }
  }

  return whitelist;
};

export { getTypeWhitelist };
