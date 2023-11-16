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
];

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
  "Account",
  "Contact",
  "Group",
  "Order",
  "AggregateOrderByStringClause",
  "NoFunctionAggregateOrderByClause",
  "AggregateOrderByNumberClause",
];

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
];
const additionalObjects = [
  "Query",
  "UIAPI",
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
];

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

  for (const objectToKeep of objectsToKeep) {
    for (const suffix of objectSuffixes) {
      whitelist.push(`${objectToKeep}${suffix}`);
    }
  }

  return whitelist;
};

export { getTypeWhitelist };
