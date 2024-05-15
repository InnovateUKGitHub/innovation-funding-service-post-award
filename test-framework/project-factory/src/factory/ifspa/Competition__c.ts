import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldToApex, injectFieldsToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";

const competitionBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Competition__c",
      fields: [
        {
          sfdcName: "Acc_CompetitionCode__c",
          sfdcType: ProjectFactoryFieldType.STRING,
          nullable: false,
          prefixed: true,
        },
        { sfdcName: "Acc_CompetitionType__c", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "Acc_CompetitionName__c", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
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
      priority: ProjectFactoryApexInjectionOrder.COMPETITION_LOAD,
    },
  ],
);

export { competitionBuilder };
