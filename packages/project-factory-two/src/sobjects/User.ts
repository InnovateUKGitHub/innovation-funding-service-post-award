import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";
import { Contact } from "./Contact";

class User extends AbstractSObject {
  public readonly sobject = "User";

  @SObjectField({ nullable: false, readonly: false })
  accessor Username: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Email: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor FirstName: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor LastName: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Alias: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor CommunityNickname: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor EmailEncodingKey: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor LocaleSidKey: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor LanguageLocaleKey: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor TimeZoneSidKey: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor ProfileId: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor ContactId: SObjectFieldType<string>;

  /**
   * Automatically populate required fields that will never change
   */
  boilerplate() {
    this.EmailEncodingKey = "UTF-8";
    this.LocaleSidKey = "en_GB";
    this.LanguageLocaleKey = "en_US";
    this.TimeZoneSidKey = "Europe/London";
    this.ProfileId = "00e58000001ITpLAAW";
  }

  static fromContact(contact: Contact, sandbox?: string): User {
    const user = new User();
    user.ContactId = contact.Id;
    user.Username = contact.Email;
    user.Email = contact.Email;
    user.FirstName = contact.FirstName;
    user.LastName = contact.LastName;

    if (typeof sandbox === "string") {
      user.Username += "." + sandbox;
    }

    return user;
  }
}

export { User };
