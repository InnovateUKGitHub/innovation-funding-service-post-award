import { graphql } from "react-relay";

const approveNewSubcontractorQuery = graphql`
  query ApproveNewSubcontractorQuery($pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Id
                New_company_subcontractor_name__c {
                  value
                }
                Company_registration_number__c {
                  value
                }
                Relationship_between_partners__c {
                  value
                }
                Relationship_justification__c {
                  value
                }
                Role_in_the_project__c {
                  value
                }
                Country_where_work_will_be_carried_out__c {
                  value
                }
                Cost_of_work__c {
                  value
                }
                Justification__c {
                  value
                }
                Acc_MarkedasComplete__c {
                  value
                }
                RecordType {
                  Name {
                    value
                    label
                  }
                  DeveloperName {
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
`;

export { approveNewSubcontractorQuery };
