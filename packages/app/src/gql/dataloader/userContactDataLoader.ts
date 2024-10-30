import { PartialGraphQLContext } from "@gql/GraphQLContext";
import DataLoader from "dataloader";

interface ContactData {
  attributes: unknown;
  Username: string;
  Id: string;
  Account: {
    Id: string; // AccountId
  };
  Contact: {
    Id: string; // ContactId
  };
}

/**
 * Get an instance of the Users dataloader, which batches requests to fetch contact ids from usernames,
 * then fetches all data required in one go instead of many separate requests.
 *
 * @param ctx The Salesforce Context
 * @returns A dataloader that fetches the user for each username
 */
const getUserContactDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, ContactData | null>(async usernames => {
    const data = await ctx.api
      .sobject("user")
      .select<ContactData>(["Username", "Id", "Account.Id", "Contact.Id"])
      .where({ username: usernames })
      .execute();

    // For each key that was passed in, find the user id.
    // A map is chosen to ensure the data is in the EXACT order as requested.
    return usernames.map(
      username => data.records.find(x => x.Username.toLowerCase() === username.toLowerCase()) ?? null,
    );
  });
};

export { getUserContactDataLoader };
