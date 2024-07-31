import { UnauthenticatedError } from "@shared/appError";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IApiClient } from "@server/apis";
import { processResponse } from "@shared/processResponse";
import { removeUndefinedString } from "@shared/string-helpers";
import { ClientFileWrapper } from "../clientFileWrapper";

const clientApi: IApiClient<"client"> = {
  claims: {
    update: params =>
      ajaxPut(
        `/api/claims/${params.projectId}/${params.partnerId}/${params.periodId}?isClaimSummary=${
          params.isClaimSummary ? "true" : "false"
        }`,
        params.claim,
      ),
  },
  claimDetails: {
    saveClaimDetails: params =>
      ajaxPut(
        `/api/claim-details/${params.projectId}/${params.partnerId}/${params.periodId}/${params.costCategoryId}`,
        params.claimDetails,
      ),
  },
  documents: {
    uploadLoanDocuments: params =>
      ajaxPostFiles(`/api/documents/loans/${params.projectId}/${params.loanId}`, params.documents),
    deleteLoanDocument: p =>
      ajaxJson(`/api/documents/loans/${p.projectId}/${p.loanId}/${p.documentId}`, { method: "DELETE" }),
    deleteProjectChangeRequestDocumentOrItemDocument: params =>
      ajaxJson(
        `/api/documents/projectChangeRequests/${params.projectId}/${params.projectChangeRequestIdOrItemId}/${params.documentId}`,
        { method: "DELETE" },
      ),
    deleteClaimDetailDocument: ({ documentId, claimDetailKey }) =>
      ajaxJson(
        `/api/documents/claim-details/${claimDetailKey.projectId}/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}/${documentId}`,
        { method: "DELETE" },
      ),
    deleteClaimDocument: ({ documentId, claimKey }) =>
      ajaxJson(`/api/documents/claims/${claimKey.projectId}/${claimKey.partnerId}/${claimKey.periodId}/${documentId}`, {
        method: "DELETE",
      }),
    deletePartnerDocument: ({ documentId, projectId, partnerId }) =>
      ajaxJson(`/api/documents/partners/${projectId}/${partnerId}/${documentId}`, { method: "DELETE" }),
    deleteProjectDocument: ({ projectId, documentId }) =>
      ajaxJson(`/api/documents/projects/${projectId}/${documentId}`, { method: "DELETE" }),
    uploadClaimDetailDocuments: ({ claimDetailKey, documents }) =>
      ajaxPostFiles(
        `/api/documents/claim-details/${claimDetailKey.projectId}/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}`,
        documents,
      ),
    uploadClaimDocuments: ({ claimKey, documents }) =>
      ajaxPostFiles(
        `/api/documents/claimDocuments/${claimKey.projectId}/${claimKey.partnerId}/${claimKey.periodId}`,
        documents,
      ),
    uploadProjectChangeRequestDocumentOrItemDocument: ({ projectId, projectChangeRequestIdOrItemId, documents }) =>
      ajaxPostFiles(`/api/documents/projectChangeRequests/${projectId}/${projectChangeRequestIdOrItemId}`, documents),
    uploadProjectDocument: ({ projectId, documents }) =>
      ajaxPostFiles(`/api/documents/projects/${projectId}`, documents),
    uploadPartnerDocument: ({ projectId, partnerId, documents }) =>
      ajaxPostFiles(`/api/documents/partners/${projectId}/${partnerId}`, documents),
  },
  financialVirements: {
    update: params =>
      ajaxPut(
        `/api/financial-virements/${params.projectId}/${params.pcrId}/${params.pcrItemId}/?partnerId=${params.partnerId}&submit=${params.submit}`,
        params.financialVirement,
      ),
  },
  financialLoanVirements: {
    update: params =>
      ajaxPut(
        `/api/financial-loan-virements/${params.projectId}/${params.pcrItemId}?submit=${params.submit}`,
        params.financialVirement,
      ),
  },
  forecastDetails: {
    update: params =>
      ajaxPut(
        `/api/forecast-details/?projectId=${params.projectId}&partnerId=${params.partnerId}&submit=${params.submit}`,
        params.forecasts,
      ),
  },
  initialForecastDetails: {
    update: params =>
      ajaxPut(
        `/api/initial-forecast-details/?projectId=${params.projectId}&partnerId=${params.partnerId}&submit=${params.submit}`,
        params.forecasts,
      ),
  },
  loans: {
    update: params => ajaxPut(`/api/loans/${params.projectId}/${params.loanId}`, params.loan),
  },
  monitoringReports: {
    createMonitoringReport: params =>
      ajaxPost(`/api/monitoring-reports?submit=${params.submit}`, params.monitoringReportDto),
    saveMonitoringReport: params =>
      ajaxPut(`/api/monitoring-reports?submit=${params.submit}`, params.monitoringReportDto),
    deleteMonitoringReport: params =>
      ajax(`/api/monitoring-reports/${params.projectId}/${params.reportId}`, { method: "DELETE" }),
  },
  pcrs: {
    create: params => ajaxPost(`/api/pcrs/${params.projectId}`, params.projectChangeRequestDto),
    update: params => ajaxPut(`/api/pcrs/${params.projectId}/${params.id}`, params.pcr),
    delete: params => ajaxDelete(`/api/pcrs/${params.projectId}/${params.id}`),
  },
  projectContacts: {
    update: params => ajaxPut(`/api/project-contacts/${params.projectId}`, params.contacts),
  },
  partners: {
    updatePartner: params =>
      ajaxPut(
        `/api/partners/${params.partnerId}?validateBankDetails=${params.validateBankDetails}&verifyBankDetails=${params.verifyBankDetails}`,
        params.partnerDto,
      ),
  },
};

const getJsonHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return headers;
};

const ajax = <T>(rawQueryUrl: string, opts?: RequestInit): Promise<T> => {
  const options = { credentials: "same-origin" as RequestCredentials, ...opts };

  const queryUrl = removeUndefinedString(rawQueryUrl);

  const request = fetch(queryUrl, options);

  return request.then(response => {
    if (response.ok) {
      return processResponse(response);
    }

    if (response.status === 401 && (options.method || "GET") === "GET") {
      window.location.reload();
      return new Promise<T>(() => {
        // Nothing to return as we never want to use this result!
      });
    } else if (response.status === 401) {
      return Promise.reject(new UnauthenticatedError());
    }

    return response
      .json()
      .catch(() => Promise.reject(response.statusText))
      .then(errText => Promise.reject(errText));
  });
};

const ajaxJson = <T>(url: string, opts?: RequestInit): Promise<T> => {
  const headers = getJsonHeaders();
  const options = Object.assign({ headers }, opts);
  return ajax(url, options);
};

const ajaxPost = <T>(url: string, body: AnyObject = {}, opts?: RequestInit) => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return ajaxJson<T>(url, options);
};

const ajaxDelete = <T>(url: string, opts?: RequestInit): Promise<T> => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "DELETE",
  });

  return ajaxJson<T>(url, options);
};

const ajaxPostFiles = <T>(url: string, documents: MultipleDocumentUploadDto) => {
  const formData = new FormData();
  documents.files.forEach(file => {
    formData.append("attachment", (file as ClientFileWrapper).file);
  });
  if (documents.description) {
    formData.append("description", documents.description.toString());
  }
  if (documents.partnerId) {
    formData.append("partnerId", documents.partnerId);
  }
  return ajaxPostFormData<T>(url, formData);
};

const ajaxPostFormData = <T>(url: string, formData: FormData, opts?: RequestInit) => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "POST",
    body: formData,
  });
  return ajax<T>(url, options);
};

const ajaxPut = <T>(url: string, body: AnyObject, opts?: RequestInit) => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return ajaxJson<T>(url, options);
};

const clientsideApiClient = clientApi as unknown as IApiClient<"server">;
const apiClient = clientApi as unknown as IApiClient<"server">;

export { apiClient, clientsideApiClient };
