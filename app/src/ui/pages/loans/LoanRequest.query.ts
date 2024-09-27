import { graphql } from "react-relay";

export const loanRequestQuery = graphql`
  query LoanRequestQuery($projectId: ID!, $loanId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                  isAssociate
                }
              }
            }
          }
          Acc_Prepayment__c(
            where: {
              and: [{ Acc_ProjectParticipant__r: { Acc_ProjectId__c: { eq: $projectId } } }, { Id: { eq: $loanId } }]
            }
            orderBy: { Acc_PeriodNumber__c: { order: ASC } }
            first: 1000
          ) {
            edges {
              node {
                Id
                Acc_PeriodNumber__c {
                  value
                }
                Acc_GranttobePaid__c {
                  value
                }
                Loan_DrawdownStatus__c {
                  value
                }
                Loan_LatestForecastDrawdown__c {
                  value
                }
                Loan_PlannedDateForDrawdown__c {
                  value
                }
                Loan_UserComments__c {
                  value
                }
                Acc_ProjectParticipant__r {
                  Acc_TotalParticipantCosts__c {
                    value
                  }
                  Acc_TotalGrantApproved__c {
                    value
                  }
                }
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { LastModifiedDate: { order: DESC } } }) {
                  edges {
                    node {
                      isFeedAttachment
                      isOwner
                      LinkedEntityId {
                        value
                      }
                      ContentDocument {
                        Id
                        LastModifiedBy {
                          ContactId {
                            value
                          }
                        }
                        LatestPublishedVersionId {
                          value
                        }
                        Description {
                          value
                        }
                        ContentSize {
                          value
                        }
                        CreatedDate {
                          value
                        }
                        FileType {
                          value
                        }
                        FileExtension {
                          value
                        }
                        Title {
                          value
                        }
                        LastModifiedDate {
                          value
                        }
                        CreatedBy {
                          Id
                          Name {
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
    }
  }
`;
