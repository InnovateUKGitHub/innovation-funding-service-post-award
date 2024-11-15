import { useLazyLoadQuery } from "react-relay";
import { FailedBankCheckConfirmationQuery } from "./__generated__/FailedBankCheckConfirmationQuery.graphql";
import { failedBankCheckConfirmationQuery } from "./FailedBankCheckConfirmation.query";

export const useFailedBankCheckConfirmationData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<FailedBankCheckConfirmationQuery>(
    failedBankCheckConfirmationQuery,
    { projectId },
    { fetchPolicy: "network-only" },
  );

  return { fragmentRef: data?.salesforce?.uiapi };
};
