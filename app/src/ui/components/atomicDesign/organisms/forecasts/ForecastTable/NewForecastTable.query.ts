import { graphql } from "react-relay";

export const newForecastTableQuery = graphql`
  query NewForecastTableQuery($projectId: ID!, $projectParticipantId: ID!) {
    salesforce {
      uiapi {
        ...NewForecastTableFragment
      }
    }
  }
`;
