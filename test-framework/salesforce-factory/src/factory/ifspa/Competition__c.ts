import { AccOrder } from "../../enum/AccOrder";
import { injectFieldToApex, injectRelationshipToApex } from "../../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";

const competitionBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Competition__c",
      fields: [
        { sfdcName: "Acc_CompetitionCode__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_CompetitionType__c", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Acc_CompetitionName__c", sfdcType: SffFieldType.STRING, nullable: false },
      ],
      relationships: [],
    },
    generator: {
      varName: x => `competition${x}`,
    },
  },
  ({ fields, instanceName }) => {
    return [
      {
        code: `
          Competition__c ${instanceName} = new Competition__c();
          ${injectFieldToApex(instanceName, "Acc_CompetitionCode__c", fields.Acc_CompetitionCode__c)}
          ${injectFieldToApex(instanceName, "Acc_CompetitionType__c", fields.Acc_CompetitionType__c)}
          ${injectFieldToApex(instanceName, "Acc_CompetitionName__c", fields.Acc_CompetitionName__c)}
          insert ${instanceName};
        `,
        priority: AccOrder.COMPETITION_LOAD,
      },
    ];
  },
);

export { competitionBuilder };
