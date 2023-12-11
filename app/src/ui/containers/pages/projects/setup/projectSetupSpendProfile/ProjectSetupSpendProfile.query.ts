import { graphql } from "react-relay";
export const projectSetupSpendProfileQuery = graphql`
  query ProjectSetupSpendProfileQuery($projectId: ID!, $projectParticipantId: ID!) {
    salesforce {
      uiapi {
        ...NewForecastTableFragment
        ...PageFragment
      }
    }
  }
`;
