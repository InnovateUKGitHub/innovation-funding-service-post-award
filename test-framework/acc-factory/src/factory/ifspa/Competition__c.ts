import { AccOrder } from "../../enum/AccOrder";
import { injectFieldToApex, injectFieldsToApex } from "../../helpers/apex";
import { AccFieldType } from "../../types/AccFactoryDefinition";
import { AccFactory } from "../AccFactory";

const competitionBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "Competition__c",
      fields: [
        { sfdcName: "Acc_CompetitionCode__c", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Acc_CompetitionType__c", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "Acc_CompetitionName__c", sfdcType: AccFieldType.STRING, nullable: false },
      ],
      relationships: [],
    },
    generator: {
      varName: x => `competition${x}`,
    },
  },
  ({ fields, instanceName, options }) => [
    {
      code: `
Competition__c ${instanceName} = new Competition__c();
${injectFieldsToApex(options, instanceName, fields)}
insert ${instanceName};
      `,
      priority: AccOrder.COMPETITION_LOAD,
    },
  ],
);

export { competitionBuilder };
