import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectApexFunctionCall, injectFieldToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { projectFactoryProfilesHelperBuilder } from "./ProjectFactory.ProfilesHelper";

const accProfileTotalCostCategoryBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Acc_Profile__c",
      fields: [
        {
          sfdcName: "Acc_CostCategoryDescription__c",
          sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST,
          nullable: false,
          values: [
            "Subcontracting",
            "Labour",
            "Overheads",
            "Materials",
            "Capital Usage",
            "Travel and Subsistence",
            "Other costs",
            "Other costs 2",
            "Other costs 3",
            "Other costs 4",
            "Other costs 5",
          ],
        },
        {
          sfdcName: "Acc_CostCategoryGOLCost__c",
          sfdcType: ProjectFactoryFieldType.NUMBER,
          nullable: true,
        },
      ],
      relationships: [
        {
          sfdcName: "ProjectFactory_ProfileHelper",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: projectFactoryProfilesHelperBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `profileTotalCostCategory${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Acc_Profile__c ${instanceName} = ${injectApexFunctionCall(relationships.ProjectFactory_ProfileHelper, "CostCategory", [
        fields.Acc_CostCategoryDescription__c,
      ])};
${injectFieldToApex(options, instanceName, "Acc_CostCategoryGOLCost__c", fields.Acc_CostCategoryGOLCost__c)}
    `,
      priority: ProjectFactoryApexInjectionOrder.ACC_PROFILE_TOTAL_COST_CATEGORY,
    },
  ],
);

export { accProfileTotalCostCategoryBuilder };
