import { graphql } from "relay-runtime";

const developerCurrentDevelopmentUsernameQuery = graphql`
  query DeveloperCurrentDevelopmentUsernameQuery {
    developer {
      email
    }
  }
`;

export { developerCurrentDevelopmentUsernameQuery };
