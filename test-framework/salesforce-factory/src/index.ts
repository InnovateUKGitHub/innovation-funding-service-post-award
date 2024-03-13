import { SffBuilder } from "./factory/SalesforceFactory";
import { sss } from "./helpers/apex";
import { SffFieldType, SffRelationshipType } from "./types/SffFactoryDefinition";

const contactBuilder = new SffBuilder(
  <const>{
    definition: {
      sfdcName: "Acc_Contact__c",
      fields: [{ sfdcName: "Title", sfdcType: SffFieldType.STRING, nullable: false }],
      relationships: [],
    },
  },
  ({ fields, fnNumber, fnBodies }) => {
    fnBodies.push(`
      Id createContact${fnNumber} {
        Acc_ProjectContactLink__c contact = new Acc_ProjectContactLink__c();
        ${Object.entries(fields).map(([key, value]) => `contact.${key} = ${sss(value)};`)}
        Database.insert(contact);
      }
    `);

    return `createContact${fnNumber}()`;
  },
);

const projectBuilder = new SffBuilder(
  <const>{
    definition: {
      sfdcName: "Acc_Project__c",
      fields: [
        { sfdcName: "Acc_ProjectNumber__c", sfdcType: SffFieldType.STRING, nullable: false },
        // { sfdcName: "Acc_LegacyID__c", sfdcType: SffFieldType.STRING, nullable: true },
        { sfdcName: "Acc_ProjectTitle__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME, nullable: false },
        { sfdcName: "Acc_Duration__c", sfdcType: SffFieldType.NUMBER, nullable: false },
        { sfdcName: "Acc_WorkdayProjectSetupComplete__c", sfdcType: SffFieldType.CHECKBOX, nullable: false },
        {
          sfdcName: "Acc_MonitoringLevel__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Platinum", "Gold", "Silver", "Bronze", "Internal Assurance"],
          nullable: false,
        },
        {
          sfdcName: "Acc_MonitoringReportSchedule__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Monthly", "Quarterly", "6 Monthly", "Yearly", "Internal Assurance"],
          nullable: false,
        },
        {
          sfdcName: "Acc_ClaimFrequency",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: ["Monthly", "Quarterly"],
          nullable: false,
        },
        {
          sfdcName: "Acc_ProjectStatus__c",
          sfdcType: SffFieldType.SINGLE_PICKLIST,
          values: [
            "Not set",
            "PCL Creation Complete",
            "Offer Letter Sent",
            "Live",
            "On Hold",
            "Final Claim",
            "Closed",
            "Terminated",
          ],
          nullable: false,
        },
        { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME, nullable: false },
      ],
      relationships: [{ sfdcName: "Acc_Contact__r", sfdcType: SffRelationshipType.MULTI, sffBuilder: contactBuilder }],
    },
  },
  ({ fields, relationships }) => {
    relationships.Acc_Contact__r.map(x => x.build());
  },
);

const contactA = contactBuilder.new();
const projectA = projectBuilder
  .new()
  .setField("Acc_ProjectNumber__c", "hello")
  .setField("Acc_StartDate__c", new Date())
  .setRelationship("Acc_Contact__r", [contactA]);

const crnd = projectA.copy().setField("Acc_MonitoringLevel__c", "Platinum");

const projectB = projectA.copy().setField("Acc_ProjectNumber__c", "world");
