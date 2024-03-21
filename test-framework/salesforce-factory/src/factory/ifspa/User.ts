import { AccOrder } from "../../enum/AccOrder";
import { injectFieldsToApex } from "../../helpers/apex";
import { SffFieldType } from "../../types/SffFactoryDefinition";
import { AccFactory } from "../AccFactory";

const userBuilder = new AccFactory(
  <const>{
    definition: {
      sfdcName: "User",
      fields: [
        { sfdcName: "Username", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Email", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "FirstName", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LastName", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "Alias", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "CommunityNickname", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "EmailEncodingKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LocaleSidKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "LanguageLocaleKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "TimeZoneSidKey", sfdcType: SffFieldType.STRING, nullable: false },
        { sfdcName: "ProfileId", sfdcType: SffFieldType.STRING, nullable: false },
      ],
      relationships: [],
    },
    generator: {
      varName: x => `user${x}`,
    },
  },
  ({ fields, instanceName }) => [
    {
      code: `
User ${instanceName} = new User();
${injectFieldsToApex(instanceName, fields)}
insert ${instanceName}
      `,
      priority: AccOrder.USER_LOAD,
    },
  ],
);
