import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectApexFunctionCall, injectFieldToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { projectFactoryClaimsAndProfilesHelperBuilder } from "./ProjectFactory.ClaimsAndProfilesHelper";

const accClaimTotalProjectPeriodBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Acc_Claims__c",
      fields: [
        {
          sfdcName: "Acc_ClaimStatus__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          nullable: false,
          values: [
            "Draft",
            "Independent accountant's report required",
            "New",
            "Paid",
            "Payment being processed",
            "Queried by Innovate UK",
            "Queried by Monitoring Officer",
            "Submitted to Innovate UK",
            "Submitted to Monitoring Officer",
          ],
        },
        {
          sfdcName: "Acc_ProjectPeriodNumber__c",
          sfdcType: ProjectFactoryFieldType.NUMBER,
          nullable: false,
        },
      ],
      relationships: [
        {
          sfdcName: "ProjectFactory_ProfileHelper",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: projectFactoryClaimsAndProfilesHelperBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `claimTotalProjectPeriod${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Acc_Claims__c ${instanceName} = ${injectApexFunctionCall(
        relationships.ProjectFactory_ProfileHelper,
        "ClaimProjectPeriod",
        [fields.Acc_ProjectPeriodNumber__c],
      )};
${injectFieldToApex(options, instanceName, "Acc_ClaimStatus__c", fields.Acc_ClaimStatus__c)}
    `,
      priority: ProjectFactoryApexInjectionOrder.ACC_CLAIM_TOTAL_PROJECT_PERIOD,
    },
  ],
);

export { accClaimTotalProjectPeriodBuilder };
