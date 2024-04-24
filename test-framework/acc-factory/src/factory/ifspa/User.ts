import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex, injectRelationshipToApex } from "../../helpers/apex";
import { SffFieldType, SffRelationshipType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";
import { contactBuilder } from "./Contact";

const userBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "User",
      fields: [
        { sfdcName: "Username", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "Email", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "FirstName", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Alias", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "CommunityNickname", sfdcType: SffFieldType.STRING, nullable: false, prefixed: true },
        { sfdcName: "EmailEncodingKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LocaleSidKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LanguageLocaleKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "TimeZoneSidKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "ProfileId", sfdcType: SffFieldType.STRING, nullable: false },
      ],
      relationships: [
        { sfdcName: "ContactId", sfdcType: SffRelationshipType.SINGLE, sffBuilder: contactBuilder, required: true },
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
