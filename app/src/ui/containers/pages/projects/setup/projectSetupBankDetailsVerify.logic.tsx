import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankDetailsVerifyQuery } from "./ProjectSetupBankDetailsVerify.query";
import { ProjectSetupBankDetailsVerifyQuery } from "./__generated__/ProjectSetupBankDetailsVerifyQuery.graphql";

export const useSetupBankDetailsVerifyData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<ProjectSetupBankDetailsVerifyQuery>(
    projectSetupBankDetailsVerifyQuery,
    { projectId },
    { fetchPolicy: "network-only" },
  );

  return { fragmentRef: data?.salesforce?.uiapi };
};
