import { graphql } from "relay-runtime";

const contactSetupAssociateQuery = graphql`
  query ContactSetupAssociateQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Project_Contact_Links__r(where: { Acc_Role__c: { eq: "Associate" } }, first: 2000) {
                  edges {
                    node {
                      Id
                      Acc_EmailOfSFContact__c {
                        value
                      }
                      Acc_ContactId__r {
                        Id
                        Name {
                          value
                        }
                      }
                      Associate_Start_Date__c {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { contactSetupAssociateQuery };
