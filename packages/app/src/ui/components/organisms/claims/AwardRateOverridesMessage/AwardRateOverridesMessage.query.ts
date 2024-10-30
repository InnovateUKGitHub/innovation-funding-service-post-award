import { graphql } from "react-relay";

export const awardRateOverridesMessageQuery = graphql`
  query AwardRateOverridesMessageQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...AwardRateOverridesMessageFragment
      }
    }
  }
`;
