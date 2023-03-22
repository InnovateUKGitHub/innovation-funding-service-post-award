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
 * Get an instance of the Users dataloader, which batches requests to fetch users,
 * then fetches all data required in one go instead of many separate requests.
 *
 * @param ctx The GraphQL Context
 * @returns A dataloader that fetches the user for each username
 */
const getUserContactDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, UserData | null>(async usernames => {
    const { data } = await ctx.api.executeGraphQL<{ data: RolesData }>({
      document: gql`
        query UserRolesQuery($usernames: [String!]!) {
          uiapi {
            query {
              User(where: { Username: { in: $usernames } }) {
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
        usernames,
      },
      context: ctx,
    });

    // For each key that was passed in, find the user data.
    // A map is chosen to ensure the data is in the EXACT order as requested.
    return usernames.map(
      username =>
        data.uiapi.query.User.edges.find(x => x.node?.Username?.value?.toLowerCase() === username.toLowerCase()) ??
        null,
    );
  });
};

export { getUserContactDataLoader };
