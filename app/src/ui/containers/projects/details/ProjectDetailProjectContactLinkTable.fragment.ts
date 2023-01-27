import { graphql } from "relay-runtime";

const projectDetailprojectContactLinkTableFragment = graphql`
  fragment ProjectDetailProjectContactLinkTableFragment on Acc_Project__c {
    Id
    isActive
    roles {
      isPm
      isMo
    }
    Project_Contact_Links__r {
      edges {
        node {
          Acc_EmailOfSFContact__c {
            value
          }
          Acc_ContactId__r {
            Name {
              value
            }
          }
          Acc_AccountId__r {
            Name {
              value
            }
            Id
          }
          Acc_Role__c {
            value
          }
        }
      }
    }
  }
`;

export { projectDetailprojectContactLinkTableFragment };
