import { graphql } from "relay-runtime";

const projectDetailsQuery = graphql`
  query ProjectDetailsQuery($projectId: ID!) {
    uiapi {
      query {
        Acc_Project__c(where: { Id: { eq: $projectId } }) {
          edges {
            node {
              Id
              ...ProjectStatusFragment
              ...ProjectDetailProjectContactLinkTableFragment
              ...ProjectDetailProjectParticipantsProjectTableFragment
              ...ProjectDetailProjectInformationTableFragment
              Acc_ProjectNumber__c {
                value
              }
              Acc_ProjectTitle__c {
                value
              }
              Acc_CurrentPeriodNumber__c {
                value
              }
              Acc_NumberofPeriods__c {
                value
              }
              Acc_CurrentPeriodStartDate__c {
                value
                displayValue
              }
              Acc_CurrentPeriodEndDate__c {
                value
                displayValue
              }
              Acc_CompetitionType__c {
                value
              }
            }
          }
        }
      }
    }
  }
`;

export { projectDetailsQuery };
