import { graphql } from "relay-runtime";

const projectDetailsQuery = graphql`
  query ProjectDetailsQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                isActive
                roles {
                  isMo
                  isFc
                  isPm
                  isSalesforceSystemUser
                  partnerRoles {
                    isFc
                    isMo
                    isPm
                    partnerId
                  }
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_CompetitionId__r {
                  Name {
                    value
                  }
                }
                Acc_CurrentPeriodEndDate__c {
                  value
                  displayValue
                }
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_CurrentPeriodStartDate__c {
                  value
                  displayValue
                }
                Acc_Duration__c {
                  value
                }
                Acc_EndDate__c {
                  value
                }
                Acc_LeadParticipantID__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_ProjectSummary__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_StartDate__c {
                  value
                }
                Loan_LoanAvailabilityPeriodLength__c {
                  value
                }
                Loan_LoanEndDate__c {
                  value
                }
                Loan_LoanExtensionPeriodLength__c {
                  value
                }
                Loan_LoanRepaymentPeriodLength__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(first: 500) {
                  edges {
                    node {
                      Id
                      Acc_AccountId__r {
                        Name {
                          value
                        }
                      }
                      Acc_AccountId__c {
                        value
                      }
                      Acc_ParticipantType__c {
                        value
                      }
                      Acc_ParticipantStatus__c {
                        value
                        label
                      }
                      Acc_NonfundedParticipant__c {
                        value
                      }
                      Acc_Postcode__c {
                        value
                      }
                      Acc_ProjectRole__c {
                        value
                      }
                    }
                  }
                }
                Project_Contact_Links__r(
                  orderBy: { Acc_AccountId__r: { Name: { order: ASC, nulls: LAST } } }
                  first: 2000
                ) {
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
                      Acc_AccountId__c {
                        value
                      }
                      Acc_UserId__r {
                        Name {
                          value
                        }
                      }
                      Acc_Role__c {
                        value
                        label
                      }
                      Acc_ProjectId__c {
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

export { projectDetailsQuery };
