import { ExecutableSchema } from "@gql/getGraphQLSchema";
import { PartialGraphQLContext } from "@gql/GraphQLContext";
import { Api } from "@gql/sf/Api";
import DataLoader from "dataloader";
import gql from "graphql-tag";

interface ProjectData {
  node: {
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
            Email__c: {
              value: string | null;
            } | null;
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

const getProjectRolesDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, ProjectData>(async keys => {
    const { data } = await ctx.api.executeGraphQL<{ data: RolesData }>({
      document: gql`
        query UserRolesQuery($keys: [ID]) {
          uiapi {
            query {
              Acc_Project__c(first: 2000, where: { Id: { in: $keys } }) {
                edges {
                  node {
                    Acc_ProjectParticipantsProject__r {
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
                    Project_Contact_Links__r {
                      edges {
                        node {
                          Acc_Role__c {
                            value
                          }
                          Acc_ContactId__r {
                            Email__c {
                              value
                            }
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
      },
      context: ctx,
    });
    return data.uiapi.query.Acc_Project__c.edges;
  });
};

export { getProjectRolesDataLoader };
