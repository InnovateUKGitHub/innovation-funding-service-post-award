import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { developerCurrentDevelopmentUsernameQuery } from "./DeveloperCurrentDevelopmentUsername.query";
import { DeveloperCurrentDevelopmentUsernameQuery } from "./__generated__/DeveloperCurrentDevelopmentUsernameQuery.graphql";

const DeveloperCurrentDevelopmentUsername = () => {
  const { data, isLoading } = useQuery<DeveloperCurrentDevelopmentUsernameQuery>(
    developerCurrentDevelopmentUsernameQuery,
  );

  if (isLoading) return null;

  return <>{data?.developer?.email}</>;
};

export { DeveloperCurrentDevelopmentUsername };
