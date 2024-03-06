import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { useFragment } from "react-relay";
import { projectSuspensionMessageFragment } from "./ProjectSuspensionMessage.fragment";
import {
  ProjectSuspensionMessageFragment$data,
  ProjectSuspensionMessageFragment$key,
} from "./__generated__/ProjectSuspensionMessageFragment.graphql";
import { QueryOptions } from "@gql/hooks/useRefreshQuery";

interface ProjectSuspensionMessageWithFragmentProps {
  projectId: ProjectId;
  partnerId?: PartnerId;
}

interface ProjectSuspensionMessageStandaloneProps extends ProjectSuspensionMessageWithFragmentProps {
  queryOptions?: QueryOptions;
}

interface ProjectSuspensionMessageProps extends ProjectSuspensionMessageWithFragmentProps {
  project: Pick<ProjectDtoGql, "status" | "roles" | "partnerRoles">;
  partners: Pick<PartnerDtoGql, "id" | "partnerStatus" | "isFlagged">[];
}

const useProjectSuspensionMessageWithFragmentData = (fragmentRef: unknown) => {
  if (!isValidFragmentKey<ProjectSuspensionMessageFragment$key>(fragmentRef, "ProjectSuspensionMessageFragment")) {
    throw new Error("Project Suspension Message is missing a ProjectSuspensionMessageFragment reference");
  }

  const fragment: ProjectSuspensionMessageFragment$data = useFragment(projectSuspensionMessageFragment, fragmentRef);

  const projectNode = getFirstEdge(fragment?.query?.ProjectSuspensionProject?.edges).node;

  const project = mapToProjectDto(projectNode, ["status", "roles", "partnerRoles"]);
  const partners = mapToPartnerDtoArray(
    projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [],
    ["id", "partnerStatus", "isFlagged"],
    {},
  );

  return { project, partners };
};

export {
  ProjectSuspensionMessageProps,
  ProjectSuspensionMessageStandaloneProps,
  ProjectSuspensionMessageWithFragmentProps,
  useProjectSuspensionMessageWithFragmentData,
};
