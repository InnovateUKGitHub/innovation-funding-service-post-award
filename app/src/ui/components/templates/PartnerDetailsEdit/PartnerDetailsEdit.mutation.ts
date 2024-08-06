import { graphql } from "react-relay";

export const partnerDetailsEditMutation = graphql`
  mutation PartnerDetailsEditMutation(
    $partnerId: IdOrRef!
    $postcode: String!
    $projectId: String!
    $partnerIdStr: String!
  ) {
    uiapi(projectId: $projectId, partnerId: $partnerIdStr) {
      Acc_ProjectParticipant__cUpdate(
        input: { Id: $partnerId, Acc_ProjectParticipant__c: { Acc_Postcode__c: $postcode } }
      ) {
        success
      }
    }
  }
`;
