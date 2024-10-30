import { useFragment } from "react-relay";
import { Logs as LogsComponent } from "./logs";
import { statusChangesLogsFragment } from "./StatusChangesLogs.fragment";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { StatusChangesLogsFragment$key } from "./__generated__/StatusChangesLogsFragment.graphql";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { mapToClaimStatusChangeDtoArray } from "@gql/dtoMapper/mapClaimStatusChange";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";

export const Logs = (props: { qa: string }) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<StatusChangesLogsFragment$key>(fragmentRef, "StatusChangesLogsFragment")) {
    throw new Error("Logs component is missing a StatusChangesLogsFragment reference");
  }

  const fragment = useFragment(statusChangesLogsFragment, fragmentRef);
  const { node: projectNode } = getFirstEdge(fragment?.query?.StatusChanges_Project?.edges);

  const project = mapToProjectDto(projectNode, ["competitionType", "roles"]);

  const statusChanges = mapToClaimStatusChangeDtoArray(
    fragment.query?.StatusChanges_StatusChanges?.edges ?? [],
    ["comments", "createdBy", "createdDate", "newStatusLabel"],
    { roles: project.roles, competitionType: project.competitionType },
  );

  return <LogsComponent data={statusChanges} {...props} />;
};
