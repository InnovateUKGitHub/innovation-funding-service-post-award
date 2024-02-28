import { graphql } from "relay-runtime";

const contactSetupAssociateQuery = graphql`
  query ContactSetupAssociateQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_StartDate__c {
                  value
                }
                Acc_EndDate__c {
                  value
                }
                Project_Contact_Links__r(where: { Acc_Role__c: { eq: "Associate" } }, first: 2000) {
                  edges {
                    node {
                      Id
                      Acc_EmailOfSFContact__c {
                        value
                      }
                      Acc_ContactId__r {
                        Name {
                          value
                        }
                      }
                      Acc_StartDate__c {
                        value
                      }
                      Acc_EndDate__c {
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
