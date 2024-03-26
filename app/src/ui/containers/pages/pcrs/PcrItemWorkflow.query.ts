import { graphql } from "react-relay";

export const pcrItemWorkflowQuery = graphql`
  query PcrItemWorkflowQuery($projectId: ID!, $pcrId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        ...TitleFragment
        ...NavigationArrowsFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                isActive
                Acc_CompetitionId__r {
                  Acc_TypeofAid__c {
                    value
                  }
                }
                Acc_ProjectStatus__c {
                  value
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(
            first: 1
            where: {
              and: [
                { Id: { eq: $pcrItemId } }
                { Acc_RequestHeader__c: { eq: $pcrId } }
                { Acc_RequestHeader__r: { Acc_Project__c: { eq: $projectId } } }
              ]
            }
          ) {
            edges {
              node {
                Id
                Acc_RequestNumber__c {
                  value
                }
                Acc_ProjectRole__c {
                  value
                }
                Acc_ParticipantType__c {
                  value
                }
                Acc_CommercialWork__c {
                  value
                }
                Acc_OtherFunding__c {
                  value
                }
                Acc_MarkedasComplete__c {
                  value
                }
                RecordType {
                  DeveloperName {
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
`;
