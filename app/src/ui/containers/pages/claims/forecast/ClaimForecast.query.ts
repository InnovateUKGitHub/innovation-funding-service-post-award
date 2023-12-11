import { graphql } from "relay-runtime";

const claimForecastQuery = graphql`
  query ClaimForecastQuery($projectId: ID!, $projectParticipantId: ID!) {
    salesforce {
      uiapi {
        ...NewForecastTableFragment
        ...TitleFragment
      }
    }
  }
`;

export { claimForecastQuery };
