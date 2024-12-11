import { PartialGraphQLContext } from "@gql/GraphQLContext";
import { CachedDataloaderFactory } from "@server/dataloaderCache";
import { DataloaderNotFoundError } from "@server/repositories/errors";
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

const usernameCache = new CachedDataloaderFactory<UserData>();

/**
 * Get an instance of the Username dataloader, which batches requests to fetch usernames from contact ids,
 * then fetches all data required in one go instead of many separate requests.
 *
 * @param ctx The GraphQL Context
 * @returns A dataloader that fetches the user for each username
 */
const getUsernameDataLoader = (ctx: PartialGraphQLContext) =>
  usernameCache.getDataloader(ctx.email, async contacts => {
    const { data } = await ctx.api.executeGraphQL<RolesData>({
      document: gql`
        query UsernameQuery($contacts: [ID!]!) {
          uiapi {
            query {
              User(where: { ContactId: { in: $contacts } }, first: 2000) {
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
    return contacts.map(
      contact =>
        data.uiapi.query.User.edges.find(x => x.node?.ContactId?.value === contact) ??
        new DataloaderNotFoundError({
          name: "Contact",
          key: contact,
        }),
    );
  });

export { getUsernameDataLoader };
