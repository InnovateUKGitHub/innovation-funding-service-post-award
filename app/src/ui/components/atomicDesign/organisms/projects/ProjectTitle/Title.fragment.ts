import { graphql } from "react-relay";

export const titleFragment = graphql`
  fragment TitleFragment on UIAPI {
    query {
      Title_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Acc_ProjectNumber__c {
              value
            }
            Acc_ProjectTitle__c {
              value
            }
          }
        }
      }
    }
  }
`;
