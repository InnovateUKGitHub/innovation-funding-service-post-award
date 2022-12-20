import { graphql } from "relay-hooks";

const query = graphql`
  query ProjectRolesQuery {
    accProjectCustom {
      id
      accProjectParticipantsProjectReference {
        accProjectRoleCustom
        accAccountIdCustom {
          id
        }
      }
      projectContactLinksReference {
        accRoleCustom
        accContactIdCustom {
          email
        }
        accAccountIdCustom {
          id
        }
      }
    }
    currentUser {
      email
      isSystemUser
    }
  }
`;
export { query as projectRolesQuery };
