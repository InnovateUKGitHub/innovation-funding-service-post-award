import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { accountBuilder } from "./Account";

const contactBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "Contact",
      fields: [
        {
          sfdcName: "ContactMigrationId__c",
          sfdcType: ProjectFactoryFieldType.STRING,
          nullable: false,
          prefixed: true,
        },
        { sfdcName: "FirstName", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "Email", sfdcType: ProjectFactoryFieldType.STRING, nullable: false, prefixed: true },
      ],
      relationships: [
        {
          sfdcName: "AccountId",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: accountBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `contact${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
Contact ${instanceName} = new Contact();
${injectFieldsToApex(options, instanceName, fields)}
${injectRelationshipToApex(instanceName, "AccountId", relationships.AccountId)}
insert ${instanceName};
      `,
      priority: ProjectFactoryApexInjectionOrder.CONTACT_LOAD,
    },
  ],
);

export { contactBuilder };
