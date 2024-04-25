import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { loanRequestQuery } from "./LoanRequest.query";
import { LoanRequestQuery } from "./__generated__/LoanRequestQuery.graphql";
import { mapToLoanDtoArray } from "@gql/dtoMapper/mapLoanDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { LoanRequestSchemaType } from "./loanRequest.zod";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";
import { LoanDto } from "@framework/dtos/loanDto";
import { useNavigate } from "react-router-dom";

export type Loan = {
  id: LoanId;
  period: number;
  status: string;
  forecastAmount: number;
  comments: string;
  requestDate: Date | null;
};

export const useLoanRequestData = (
  projectId: ProjectId,
  loanId: LoanId,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<LoanRequestQuery>(loanRequestQuery, { projectId, loanId }, refreshedQueryOptions);

  const projectGqlData = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const loanGqlData = data?.salesforce?.uiapi?.query?.Acc_Prepayment__c?.edges;

  const project = mapToProjectDto(projectGqlData?.node, ["roles"]);

  const loans = mapToLoanDtoArray(loanGqlData ?? null, [
    "id",
    "amount",
    "period",
    "status",
    "forecastAmount",
    "comments",
    "requestDate",
    "totals",
  ]);

  const documentLinks = loanGqlData?.flatMap(x => x?.node?.ContentDocumentLinks?.edges ?? []);

  const documents =
    documentLinks?.map(x =>
      mapToDocumentSummaryDto(
        x,
        ["id", "dateCreated", "description", "fileName", "fileSize", "isOwner", "uploadedBy", "link", "linkedEntityId"],
        {
          type: "loan",
          projectId,
          loanId,
        },
      ),
    ) ?? [];

  return {
    documents,
    project,
    loans,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

export const useOnUpdateLoanRequest = (projectId: ProjectId, loanId: LoanId, loan: LoanDto, navigateTo: string) => {
  const navigate = useNavigate();
  return useOnUpdate<z.output<LoanRequestSchemaType>, {}>({
    req: data => {
      return clientsideApiClient.loans.update({
        projectId,
        loanId,
        loan: { ...loan, comments: data.comments ?? "" },
      });
    },
    onSuccess() {
      navigate(navigateTo);
    },
  });
};
