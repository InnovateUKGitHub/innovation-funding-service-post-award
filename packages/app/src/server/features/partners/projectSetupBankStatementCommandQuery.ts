import gql from "graphql-tag";

export const projectSetupBankStatementCommandQuery = gql`
  query ProjectSetupBankStatementCommandQuery($projectId: ID!, $partnerId: ID!) {
    uiapi {
      query {
        Acc_Project__c(where: { Id: { eq: $projectId } }) {
          edges {
            node {
              Acc_ProjectStatus__c {
                value
              }
            }
          }
        }
        Acc_ProjectParticipant__c(
          where: { and: [{ Id: { eq: $partnerId } }, { Acc_ProjectId__c: { eq: $projectId } }] }
        ) {
          edges {
            node {
              ContentDocumentLinks(first: 2, where: { ContentDocument: { Description: { eq: "BankStatement" } } }) {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`;

export interface ProjectSetupBankStatementCommandData {
  uiapi: {
    query: {
      Acc_Project__c: {
        edges: [
          {
            node: {
              Acc_ProjectStatus__c: {
                value: string;
              };
            };
          },
        ];
      };
      Acc_ProjectParticipant__c: {
        edges: [
          {
            node: {
              ContentDocumentLinks: {
                totalCount: number;
              };
            };
          },
        ];
      };
    };
  };
}
