import { graphql } from "react-relay";

export const forecastTableQuery = graphql`
  query ForecastTableQuery($projectId: ID!, $projectIdStr: String!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...ForecastTableFragment
      }
    }
  }
`;
