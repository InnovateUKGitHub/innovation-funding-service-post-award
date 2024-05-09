import { graphql } from "react-relay";
export const projectSetupSpendProfileQuery = graphql`
  query ProjectSetupSpendProfileQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...NewForecastTableFragment
        ...PageFragment
      }
    }
  }
`;
