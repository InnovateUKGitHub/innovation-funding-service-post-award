import { PartialGraphQLContext } from "@gql/GraphQLContext";
import DataLoader from "dataloader";
import gql from "graphql-tag";

interface ProjectData {
  node: {
    Id: string;
    Acc_ProjectParticipantsProject__r: {
      edges: {
        node: {
          Acc_ProjectRole__c: {
            value: string;
          };
          Acc_AccountId__c: {
            value: string;
          };
        };
      }[];
    };
    Project_Contact_Links__r: {
      edges: {
        node: {
          Acc_Role__c: {
            value: string;
          };
          Acc_ContactId__r: {
            Id: string | null;
          } | null;
          Acc_AccountId__c: {
            value: string;
          };
        };
      }[];
    };
  };
}

interface RolesData {
  uiapi: {
    query: {
      Acc_Project__c: {
        edges: ProjectData[];
      };
    };
  };
}

/**
 * Get an instance of the Roles dataloader, which batches requests to fetch roles,
 * then fetches all data required in one go instead of many separate requests.
 *
 * @param ctx The GraphQL Context
 * @returns A dataloader that fetches the roles for each project
 */
const getProjectRolesDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, ProjectData | null>(async keys => {
    const { data } = await ctx.api.executeGraphQL<{ data: RolesData }>({
      document: gql`
        query UserRolesQuery($keys: [ID]) {
          uiapi {
            query {
              Acc_Project__c(first: 500, where: { Id: { in: $keys } }) {
                edges {
                  node {
                    Id
                    Acc_ProjectParticipantsProject__r(first: 500) {
                      edges {
                        node {
                          Acc_ProjectRole__c {
                            value
                          }
                          Acc_AccountId__c {
                            value
                          }
                        }
                      }
                    }
                    Project_Contact_Links__r(first: 500) {
                      edges {
                        node {
                          Acc_Role__c {
                            value
                          }
                          Acc_ContactId__r {
                            Id
                          }
                          Acc_AccountId__c {
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        keys,
        username: ctx.email,
      },
      context: ctx,
    });

    // For each key that was passed in, find the roles data.
    // A map is chosen to ensure the data is in the EXACT order as requested.
    return keys.map(key => data.uiapi.query.Acc_Project__c.edges.find(x => x.node.Id === key) ?? null);
  });
};

export { getProjectRolesDataLoader };
