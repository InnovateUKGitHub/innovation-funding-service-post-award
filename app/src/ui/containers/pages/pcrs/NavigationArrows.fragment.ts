import { graphql } from "react-relay";

export const navigationArrowsFragment = graphql`
  fragment NavigationArrowsFragment on UIAPI {
    query {
      NavigationArrows_ProjectChangeRequest: Acc_ProjectChangeRequest__c(
        where: { or: [{ Id: { eq: $pcrId } }, { Acc_RequestHeader__c: { eq: $pcrId } }] }
        first: 2000
      ) {
        edges {
          node {
            Id
            Acc_Project__c {
              value
            }
            Acc_RequestHeader__c {
              value
            }
            RecordType {
              Name {
                value
                label
              }
            }
          }
        }
      }
    }
  }
`;
