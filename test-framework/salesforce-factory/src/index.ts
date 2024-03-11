import { SffBuilder } from "./factory/SalesforceFactory";
import { SffFieldType } from "./types/SffFactoryDefinition";

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
      { sfdcName: "Acc_Contact__r", sfdcType: SffFieldType.SINGLE_RELATIONSHIP, sffBuilder: contactBuilder },
    ],
  },
});

// const contactA = contactBuilder.new({ data: { Title: "sda" } });
const projectA = projectBuilder
  .new({ fields: { Acc_StartDate__c: new Date() } })
  .setField("Acc_ProjectNumber__c", "hello")
  .setField("Acc_StartDate__c", new Date());

const projectB = projectA.copy().setField("Acc_ProjectNumber__c", "world");
