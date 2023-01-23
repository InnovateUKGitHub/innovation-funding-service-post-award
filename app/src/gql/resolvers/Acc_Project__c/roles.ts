import { ExecutableSchema } from "@gql/getGraphQLSchema";
import { GraphQLContext } from "@gql/GraphQLContext";
import type { IFieldResolverOptions } from "@graphql-tools/utils";
import { configuration } from "@server/features/common";
import gql from "graphql-tag";
import DataLoader from "dataloader";

interface ExternalRoles {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
  isSalesforceSystemUser: boolean;
}

interface ExternalPartnerRoles extends ExternalRoles {
  partnerId: string;
}

interface ExternalProjectRoles extends ExternalRoles {
  partnerRoles: ExternalPartnerRoles[];
}

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
              value: string;
            };
          };
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

const rolesResolver = (salesforceSubschema: ExecutableSchema): IFieldResolverOptions => {
  return {
    selectionSet: `{ Id }`,
    async resolve(input, args, ctx: GraphQLContext, info) {
      const projectLoader = new DataLoader<string, ProjectData>(async keys => {
        const { data } = await salesforceSubschema.executor<RolesData>({
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

      const isSalesforceSystemUser = ctx.email === configuration.salesforceServiceUser.serviceUsername;

      const { node: project } = await projectLoader.load(input.Id);

      const userPcl = project.Project_Contact_Links__r.edges.filter(
        ({ node }) => ctx.email === node.Acc_ContactId__r.Email__c.value,
      );

      const permissions: ExternalProjectRoles = {
        isMo: isSalesforceSystemUser,
        isFc: isSalesforceSystemUser,
        isPm: isSalesforceSystemUser,
        isSalesforceSystemUser,
        partnerRoles: [],
      };

      for (const { node: projectContactLink } of userPcl) {
        if (projectContactLink.Acc_Role__c.value === "Monitoring officer") permissions.isMo = true;
        if (projectContactLink.Acc_Role__c.value === "Finance contact") permissions.isFc = true;
        if (projectContactLink.Acc_Role__c.value === "Project Manager") permissions.isPm = true;

        for (const { node: projectParticipant } of project.Acc_ProjectParticipantsProject__r.edges) {
          const existingPartnerPermissions = permissions.partnerRoles.find(
            x => x.partnerId === projectParticipant.Acc_AccountId__c.value,
          );
          const partnerPermissions = existingPartnerPermissions ?? {
            isMo: isSalesforceSystemUser,
            isFc: isSalesforceSystemUser,
            isPm: isSalesforceSystemUser,
            isSalesforceSystemUser: ctx.email === configuration.salesforceServiceUser.serviceUsername,
            partnerId: projectParticipant.Acc_AccountId__c.value,
          };

          if (projectContactLink.Acc_AccountId__c.value === projectParticipant.Acc_AccountId__c.value) {
            if (permissions.isFc) partnerPermissions.isFc = true;
            if (permissions.isPm && projectParticipant.Acc_ProjectRole__c.value === "Lead")
              partnerPermissions.isPm = true;
          }

          if (!existingPartnerPermissions) permissions.partnerRoles.push(partnerPermissions);
        }
      }

      return permissions;
    },
  };
};

export { rolesResolver };
