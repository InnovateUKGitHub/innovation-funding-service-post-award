import { graphql } from "react-relay";

const projectStatusFragment = graphql`
  fragment ProjectStatusFragment on Acc_Project__c {
    Acc_ProjectStatus__c {
      value
    }
  }
`;

export { projectStatusFragment };
