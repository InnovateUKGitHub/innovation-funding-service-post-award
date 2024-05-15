import { Copy } from "@copy/Copy";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { getPending } from "@ui/helpers/get-pending";
import { Params } from "@ui/helpers/make-url";
import { useStores } from "@ui/redux/storesProvider";
import { useMemo } from "react";

/**
 * @description Returns the content solution based on the availability of the projectId (used based on condition competitionType rendering)
 */
export function useInitContent(params?: Params): Copy {
  const stores = useStores();

  // Note: It is likely that the visitor is on a non-project page or dev has forgotten 'projectId' in getParams()
  if (params && typeof params.projectId === "string") {
    const { payload } = getPending(stores.projects.getById(params.projectId as ProjectId));
    return new Copy({ competitionType: payload?.competitionType, monitoringLevel: payload?.monitoringLevel });
  } else {
    return new Copy();
  }
}

export const useCopy = ({
  projectId,
  monitoringLevel,
  competitionType,
}: {
  projectId?: ProjectId;
  monitoringLevel?: ProjectMonitoringLevel;
  competitionType?: string;
}) => {
  return useMemo(() => {
    if (projectId) {
      return new Copy({ competitionType, monitoringLevel });
    } else {
      return new Copy();
    }
  }, [projectId, monitoringLevel, competitionType]);
};
