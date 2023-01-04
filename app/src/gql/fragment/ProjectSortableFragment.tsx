import { graphql } from "relay-hooks";

const projectSortableFragment = graphql`
  fragment ProjectSortableFragment on Acc_Project__c @inline {
    Acc_ClaimsForReview__c {
      value
    }
    Acc_PCRsForReview__c {
      value
    }
    Acc_PCRsUnderQuery__c {
      value
    }
  }
`;

export { projectSortableFragment };
