import { graphql } from "react-relay";

export const newForecastTableQuery = graphql`
  query NewForecastTableQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...NewForecastTableFragment
      }
    }
  }
`;
