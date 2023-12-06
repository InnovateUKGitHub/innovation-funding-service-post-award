import { graphql } from "relay-runtime";

const companiesHouseSearchQuery = graphql`
  query CompaniesHouseSearchQuery($searchQuery: String!) {
    companies(query: $searchQuery) {
      registrationNumber
      title
      addressFull
    }
  }
`;

export { companiesHouseSearchQuery };
