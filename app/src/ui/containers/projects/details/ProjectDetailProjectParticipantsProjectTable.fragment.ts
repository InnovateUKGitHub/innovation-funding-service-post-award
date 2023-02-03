import { graphql } from "relay-runtime";

const projectDetailProjectParticipantsProjectTableFragment = graphql`
  fragment ProjectDetailProjectParticipantsProjectTableFragment on Acc_Project__c {
    Id
    Acc_LeadParticipantID__c {
      value
    }
    Acc_ProjectParticipantsProject__r {
      edges {
        node {
          Id
          Acc_AccountId__r {
            Name {
              value
            }
          }
          Acc_ParticipantType__c {
            value
          }
          Acc_ParticipantStatus__c {
            value
          }
          Acc_NonfundedParticipant__c {
            value
          }
          Acc_Postcode__c {
            value
          }
        }
      }
    }
  }
`;

export { projectDetailProjectParticipantsProjectTableFragment };
