import { graphql } from "relay-runtime";

const projectDetailProjectParticipantsProjectTableFragment = graphql`
  fragment ProjectDetailProjectParticipantsProjectTableFragment on Acc_Project__c {
    Acc_ProjectParticipantsProject__r {
      edges {
        node {
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
