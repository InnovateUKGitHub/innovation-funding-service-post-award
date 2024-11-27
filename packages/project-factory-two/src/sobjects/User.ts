import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";
import { Contact } from "./Contact";

class User extends AbstractSObject {
  public readonly sobject = "User";

  @SObjectField({ nullable: false, readonly: false })
  accessor Username: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Email: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor FirstName: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor LastName: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Alias: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor CommunityNickname: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor EmailEncodingKey: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor LocaleSidKey: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor LanguageLocaleKey: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor TimeZoneSidKey: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor ProfileId: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor ContactId: string | undefined;

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

  static fromContact(contact: Contact): User {
    const user = new User();
    user.ContactId = contact.Id;
    user.Username = contact.Email;
    user.Email = contact.Email;
    user.FirstName = contact.FirstName;
    user.LastName = contact.LastName;
    return user;
  }
}

export { User };
