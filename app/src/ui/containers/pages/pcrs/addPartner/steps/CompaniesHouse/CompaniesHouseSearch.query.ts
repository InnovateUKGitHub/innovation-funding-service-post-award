import { graphql } from "relay-runtime";

const companiesHouseSearchQuery = graphql`
  query CompaniesHouseSearchQuery($searchQuery: String!) {
    companies(query: $searchQuery, itemsPerPage: 10) {
      registrationNumber
      title
      addressFull
    }
  }
`;

export { companiesHouseSearchQuery };
