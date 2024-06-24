import { Copy } from "@copy/Copy";
import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useFetchKey } from "@ui/components/providers/FetchKeyProvider";
import { Params } from "@ui/helpers/make-url";
import { useEffect, useRef } from "react";
import { initialContentQuery } from "./InitialContent.query";
import { InitialContentQuery } from "./__generated__/InitialContentQuery.graphql";

type CopyRef = {
  copy: Copy;
  projectId: ProjectId;
  competitionType: string;
};

/**
 * @description Returns the content solution based on the availability of the projectId (used based on condition competitionType rendering)
 */
export function useInitContent(params?: Params): Copy {
  const projectId = params?.projectId ?? ("" as ProjectId);

  const [fetchKey, setFetchKey] = useFetchKey();

  const { data } = useQuery<InitialContentQuery>(initialContentQuery, { projectId }, { fetchKey });
  const project = mapToProjectDto(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges?.[0]?.node, [
    "id",
    "competitionType",
    "monitoringLevel",
  ]);

  const copyRef = useRef<CopyRef>({
    copy: new Copy(),
    projectId: "" as ProjectId,
    competitionType: "unknown",
  });

  if (projectId !== copyRef.current.projectId) {
    copyRef.current = { copy: new Copy(project), projectId: project.id, competitionType: project.competitionType };
  }

  useEffect(() => {
    setFetchKey(x => x + 1);
  }, [projectId]);

  return copyRef.current.copy;
}
