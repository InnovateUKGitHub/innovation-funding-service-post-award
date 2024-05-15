import { ProjectFactoryApexInjectionOrder } from "../../enum/ProjectFactoryApexInjectionOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { ProjectFactoryFieldType, ProjectFactoryRelationshipType } from "../../types/ProjectFactoryDefinition";
import { ProjectFactory } from "../ProjectFactory";
import { contactBuilder } from "./Contact";

const userBuilder = new ProjectFactory(
  <const>{
    definition: {
      sfdcName: "User",
      fields: [
        { sfdcName: "Username", sfdcType: ProjectFactoryFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Email", sfdcType: ProjectFactoryFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "FirstName", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "Alias", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "CommunityNickname", sfdcType: ProjectFactoryFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "EmailEncodingKey", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "LocaleSidKey", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "LanguageLocaleKey", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "TimeZoneSidKey", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
        { sfdcName: "ProfileId", sfdcType: ProjectFactoryFieldType.STRING, nullable: false },
      ],
      relationships: [
        {
          sfdcName: "ContactId",
          sfdcType: ProjectFactoryRelationshipType.SINGLE,
          sffBuilder: contactBuilder,
          required: true,
        },
      ],
    },
    generator: {
      varName: x => `user${x}`,
    },
  },
  ({ fields, relationships, instanceName, options }) => [
    {
      code: `
User ${instanceName} = new User();
${injectFieldsToApex(options, instanceName, fields)}
${injectRelationshipToApex(instanceName, "ContactId", relationships.ContactId)}
insert ${instanceName};
      `,
      priority: ProjectFactoryApexInjectionOrder.USER_LOAD,
    },
  ],
);

const defaultUser = userBuilder.new().set({
  Username: "austria@x.gov.uk",
  Email: "austria@x.gov.uk",
  FirstName: "Austria",
  LastName: "Hedges",
  Alias: "xgovuk",
  CommunityNickname: "austria",
  EmailEncodingKey: "UTF-8",
  LocaleSidKey: "en_GB",
  LanguageLocaleKey: "en_US",
  TimeZoneSidKey: "Europe/London",
  ProfileId: "00e58000001ITpLAAW",
});

export { userBuilder, defaultUser };
