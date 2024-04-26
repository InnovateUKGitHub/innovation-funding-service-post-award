import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { AccFieldType, AccRelationshipType } from "../../types/AccFactoryDefinition";
import { AccFactory } from "../AccFactory";
import { contactBuilder } from "./Contact";

const userBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "User",
      fields: [
        { sfdcName: "Username", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Email", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "FirstName", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "Alias", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "CommunityNickname", sfdcType: AccFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "EmailEncodingKey", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "LocaleSidKey", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "LanguageLocaleKey", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "TimeZoneSidKey", sfdcType: AccFieldType.STRING, nullable: false },
        { sfdcName: "ProfileId", sfdcType: AccFieldType.STRING, nullable: false },
      ],
      relationships: [
        { sfdcName: "ContactId", sfdcType: AccRelationshipType.SINGLE, sffBuilder: contactBuilder, required: true },
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
      priority: AccOrder.USER_LOAD,
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
