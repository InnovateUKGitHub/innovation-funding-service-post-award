import { graphql } from "relay-runtime";

const projectDetailProjectInformationTableFragment = graphql`
  fragment ProjectDetailProjectInformationTableFragment on Acc_Project__c {
    Acc_CompetitionId__r {
      Name {
        value
      }
    }
    Acc_CompetitionType__c {
      value
    }
    Acc_StartDate__c {
      value
    }
    Acc_EndDate__c {
      value
    }
    Loan_LoanEndDate__c {
      value
    }
    Loan_LoanAvailabilityPeriodLength__c {
      value
    }
    Loan_LoanExtensionPeriodLength__c {
      value
    }
    Loan_LoanRepaymentPeriodLength__c {
      value
    }
    Acc_Duration__c {
      value
    }
    Acc_NumberofPeriods__c {
      value
    }
    Acc_ProjectSummary__c {
      value
    }
  }
`;

export { projectDetailProjectInformationTableFragment };
