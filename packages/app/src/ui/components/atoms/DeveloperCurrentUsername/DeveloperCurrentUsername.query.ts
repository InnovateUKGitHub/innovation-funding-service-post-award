import { graphql } from "relay-runtime";

const developerCurrentUsernameQuery = graphql`
  query DeveloperCurrentUsernameQuery {
    currentUser {
      email
      isSystemUser
    }
  }
`;

export { developerCurrentUsernameQuery };
