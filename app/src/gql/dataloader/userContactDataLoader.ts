import { PartialGraphQLContext } from "@gql/GraphQLContext";
import { sss } from "@server/util/salesforce-string-helpers";
import DataLoader from "dataloader";

interface UserData {
  totalSize: number;
  done: boolean;
  records: ContactData[];
}

interface ContactData {
  attributes: unknown;
  Username: string;
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
    const data = await ctx.api.executeSOQL<UserData>({
      query: `SELECT Username, Account.Id, Contact.Id FROM user WHERE username in ('${usernames
        .map(sss)
        .join("','")}')`,
    });

    // For each key that was passed in, find the user id.
    // A map is chosen to ensure the data is in the EXACT order as requested.
    return usernames.map(
      username => data.records.find(x => x.Username.toLowerCase() === username.toLowerCase()) ?? null,
    );
  });
};

export { getUserContactDataLoader };
