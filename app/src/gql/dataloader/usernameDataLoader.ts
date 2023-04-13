import { PartialGraphQLContext } from "@gql/GraphQLContext";
import DataLoader from "dataloader";
import gql from "graphql-tag";

interface UserData {
  node: {
    Username: {
      value: string | null;
    } | null;
    ContactId: {
      value: string | null;
    } | null;
  } | null;
}

interface RolesData {
  uiapi: {
    query: {
      User: {
        edges: UserData[];
      };
    };
  };
}

/**
 * Get an instance of the Username dataloader, which batches requests to fetch usernames from contact ids,
 * then fetches all data required in one go instead of many separate requests.
 *
 * @param ctx The GraphQL Context
 * @returns A dataloader that fetches the user for each username
 */
const getUsernameDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, UserData | null>(async contacts => {
    const { data, ...rest } = await ctx.api.executeGraphQL<{ data: RolesData }>({
      document: gql`
        query UsernameQuery($contacts: [ID!]!) {
          uiapi {
            query {
              User(where: { ContactId: { in: $contacts } }) {
                edges {
                  node {
                    Username {
                      value
                    }
                    ContactId {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        contacts,
      },
      context: ctx,
    });

    // For each key that was passed in, find the user data.
    // A map is chosen to ensure the data is in the EXACT order as requested.
    return contacts.map(contact => data.uiapi.query.User.edges.find(x => x.node?.ContactId?.value === contact) ?? null);
  });
};

export { getUsernameDataLoader };
