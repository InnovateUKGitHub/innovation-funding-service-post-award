import { SffBuilder } from "./factory/SalesforceFactory";
import { SffFieldType, SffRelationshipType } from "./types/SffFactoryDefinition";

const contactBuilder = new SffBuilder(<const>{
  definition: {
    sfdcName: "Acc_Contact__c",
    fields: [{ sfdcName: "Title", sfdcType: SffFieldType.STRING }],
    relationships: [],
  },
});

const projectBuilder = new SffBuilder(<const>{
  definition: {
    sfdcName: "Acc_Project__c",
    fields: [
      { sfdcName: "Acc_ProjectNumber__c", sfdcType: SffFieldType.STRING },
      { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME },
    ],
    relationships: [{ sfdcName: "Acc_Contact__r", sfdcType: SffRelationshipType.MULTI, sffBuilder: contactBuilder }],
  },
});

const contactA = contactBuilder.new();
const projectA = projectBuilder
  .new()
  .setField("Acc_ProjectNumber__c", "hello")
  .setField("Acc_StartDate__c", new Date())
  .setRelationship("Acc_Contact__r", [contactA]);

const projectB = projectA.copy().setField("Acc_ProjectNumber__c", "world");
