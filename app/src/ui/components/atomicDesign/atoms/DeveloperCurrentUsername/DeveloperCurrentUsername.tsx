import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { developerCurrentUsernameQuery } from "./DeveloperCurrentUsername.query";
import { DeveloperCurrentUsernameQuery } from "./__generated__/DeveloperCurrentUsernameQuery.graphql";

const DeveloperCurrentUsername = () => {
  const { data, isLoading } = useQuery<DeveloperCurrentUsernameQuery>(developerCurrentUsernameQuery);

  if (isLoading) return null;

  return <>{data?.currentUser.isSystemUser ? "System User" : data?.currentUser.email ?? "Invalid User"}</>;
};

export { DeveloperCurrentUsername };
