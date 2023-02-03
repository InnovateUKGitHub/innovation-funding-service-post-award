import { graphql } from "relay-runtime";

const projectDetailprojectContactLinkTableFragment = graphql`
  fragment ProjectDetailProjectContactLinkTableFragment on Acc_Project__c {
    Id
    isActive
    roles {
      isPm
      isMo
    }
    Acc_LeadParticipantID__c {
      value
    }
    Project_Contact_Links__r(orderBy: { Acc_AccountId__r: { Name: { order: ASC, nulls: LAST } } }, first: 2000) {
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
          Acc_UserId__r {
            Name {
              value
            }
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
