import { UnauthenticatedError } from "@shared/appError";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IApiClient } from "@server/apis";
import { processResponse } from "@shared/processResponse";
import { removeUndefinedString } from "@shared/string-helpers";
import { ClientFileWrapper } from "../clientFileWrapper";

const clientApi: IApiClient<"client"> = {
  accounts: {
    getAllByJesName: params => ajaxJson(`/api/jes-accounts?search=${encodeURIComponent(params.searchString ?? "")}`),
  },
  claims: {
    getAllByProjectId: params => ajaxJson(`/api/claims/?projectId=${params.projectId}`),
    getAllByPartnerId: params => ajaxJson(`/api/claims/?partnerId=${params.partnerId}`),
    getAllIncludingNewByPartnerId: params => ajaxJson(`/api/claims/getAllIncludingNew/?partnerId=${params.partnerId}`),
    get: params => ajaxJson(`/api/claims/${params.partnerId}/${params.periodId}`),
    update: params =>
      ajaxPut(
        `/api/claims/${params.projectId}/${params.partnerId}/${params.periodId}?isClaimSummary=${
          params.isClaimSummary ? "true" : "false"
        }`,
        params.claim,
      ),
    getStatusChanges: params =>
      ajaxJson(`/api/claims/${params.projectId}/${params.partnerId}/${params.periodId}/status-changes`),
    getTotalCosts: params =>
      ajaxJson(`/api/claims/${params.projectId}/${params.partnerId}/${params.periodId}/total-costs`),
  },
  claimOverrides: {
    getAllByPartner: params => ajaxJson(`/api/claim-overrides/${params.partnerId}`),
  },
  companies: {
    searchCompany: params =>
      ajaxJson(
        `/api/companies?searchString=${encodeURIComponent(params.searchString)}&itemsPerPage=${
          params.itemsPerPage
        }&startIndex=${params.startIndex}`,
      ),
  },
  costsSummary: {
    getAllByPartnerIdForPeriod: params =>
      ajaxJson(
        `/api/costs-summary?projectId=${params.projectId}&partnerId=${params.partnerId}&periodId=${params.periodId}`,
      ),
  },
  claimDetails: {
    get: params =>
      ajaxJson(
        `/api/claim-details/${params.projectId}/${params.partnerId}/${params.periodId}/${params.costCategoryId}`,
      ),
    saveClaimDetails: params =>
      ajaxPut(
        `/api/claim-details/${params.projectId}/${params.partnerId}/${params.periodId}/${params.costCategoryId}`,
        params.claimDetails,
      ),
    getAllByPartner: params => ajaxJson(`/api/claim-details/?partnerId=${params.partnerId}`),
  },
  costCategories: {
    getAll: () => ajaxJson("/api/cost-categories"),
    getAllFiltered: params => ajaxJson(`/api/cost-categories/filtered/${params.partnerId}`),
  },
  documents: {
    getLoanDocuments: params => ajaxJson(`/api/documents/loans/${params.projectId}/${params.loanId}`),
    uploadLoanDocuments: params =>
      ajaxPostFiles(`/api/documents/loans/${params.projectId}/${params.loanId}`, params.documents),
    deleteLoanDocument: p =>
      ajaxJson(`/api/documents/loans/${p.projectId}/${p.loanId}/${p.documentId}`, { method: "DELETE" }),
    getClaimDocuments: params =>
      ajaxJson(
        `/api/documents/claims/${params.projectId}/${params.partnerId}/${params.periodId}/?description=${
          params.description || ""
        }`,
      ),
    getClaimDetailDocuments: ({ claimDetailKey }) =>
      ajaxJson(
        `/api/documents/claim-details/${claimDetailKey.projectId}/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}`,
      ),
    getProjectChangeRequestDocumentsOrItemDocuments: params =>
      ajaxJson(`/api/documents/projectChangeRequests/${params.projectId}/${params.projectChangeRequestIdOrItemId}`),
    getProjectDocuments: params => ajaxJson(`/api/documents/projects/${params.projectId}`),
    getPartnerDocuments: params => ajaxJson(`/api/documents/partners/${params.projectId}/${params.partnerId}`),
    getAllPartnerDocuments: params => ajaxJson(`/api/documents/partners/${params.projectId}`),
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
    uploadClaimDocument: ({ claimKey, document }) =>
      ajaxPostFile(`/api/documents/claims/${claimKey.projectId}/${claimKey.partnerId}/${claimKey.periodId}`, document),
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
    get: params =>
      ajaxJson(
        `/api/financial-virements/${params.projectId}/${params.pcrId}/${params.pcrItemId}/?partnerId=${params.partnerId}`,
      ),
    update: params =>
      ajaxPut(
        `/api/financial-virements/${params.projectId}/${params.pcrId}/${params.pcrItemId}/?partnerId=${params.partnerId}&submit=${params.submit}`,
        params.financialVirement,
      ),
  },
  financialLoanVirements: {
    get: params => ajaxJson(`/api/financial-loan-virements/${params.projectId}/${params.pcrItemId}`),
    update: params =>
      ajaxPut(
        `/api/financial-loan-virements/${params.projectId}/${params.pcrItemId}?submit=${params.submit}`,
        params.financialVirement,
      ),
  },
  forecastDetails: {
    getAllByPartnerId: params => ajaxJson(`/api/forecast-details/?partnerId=${params.partnerId}`),
    get: params => ajaxJson(`/api/forecast-details/${params.partnerId}/${params.periodId}/${params.costCategoryId}`),
    update: params =>
      ajaxPut(
        `/api/forecast-details/?projectId=${params.projectId}&partnerId=${params.partnerId}&submit=${params.submit}`,
        params.forecasts,
      ),
  },
  initialForecastDetails: {
    getAllByPartnerId: params => ajaxJson(`/api/initial-forecast-details/?partnerId=${params.partnerId}`),
    update: params =>
      ajaxPut(
        `/api/initial-forecast-details/?projectId=${params.projectId}&partnerId=${params.partnerId}&submit=${params.submit}`,
        params.forecasts,
      ),
  },
  forecastGolCosts: {
    getAllByPartnerId: params => ajaxJson(`/api/forecast-gol-costs/?partnerId=${params.partnerId}`),
  },
  loans: {
    getAll: params => ajax(`/api/loans/${params.projectId}`),
    get: params => ajax(`/api/loans/get/${params.projectId}/?loanId=${params.loanId}&periodId=${params.periodId}`),
    update: params => ajaxPut(`/api/loans/${params.projectId}/${params.loanId}`, params.loan),
  },
  monitoringReports: {
    createMonitoringReport: params =>
      ajaxPost(`/api/monitoring-reports?submit=${params.submit}`, params.monitoringReportDto),
    get: params => ajaxJson(`/api/monitoring-reports/${params.projectId}/${params.reportId}`),
    getAllForProject: params => ajax(`/api/monitoring-reports/?projectId=${params.projectId}`),
    saveMonitoringReport: params =>
      ajaxPut(`/api/monitoring-reports?submit=${params.submit}`, params.monitoringReportDto),
    deleteMonitoringReport: params =>
      ajax(`/api/monitoring-reports/${params.projectId}/${params.reportId}`, { method: "DELETE" }),
    getActiveQuestions: () => ajax("/api/monitoring-reports/questions"),
    getStatusChanges: params => ajax(`/api/monitoring-reports/status-changes/${params.projectId}/${params.reportId}`),
  },
  pcrs: {
    create: params => ajaxPost(`/api/pcrs/${params.projectId}`, params.projectChangeRequestDto),
    getAll: params => ajax(`/api/pcrs?projectId=${params.projectId}`),
    get: params => ajax(`/api/pcrs/${params.projectId}/${params.id}`),
    getTypes: params => ajax(`/api/pcrs/all-types/${params.projectId}`),
    getAvailableTypes: params => ajax(`/api/pcrs/available-types?projectId=${params.projectId}&pcrId=${params.pcrId}`),
    getTimeExtensionOptions: params => ajax(`/api/pcrs/time-extension-options?projectId=${params.projectId}`),
    update: params => ajaxPut(`/api/pcrs/${params.projectId}/${params.id}`, params.pcr),
    delete: params => ajaxDelete(`/api/pcrs/${params.projectId}/${params.id}`),
    getStatusChanges: params => ajax(`/api/pcrs/status-changes/${params.projectId}/${params.projectChangeRequestId}`),
    getPcrProjectRoles: () => ajax("/api/pcrs/project-roles"),
    getPcrPartnerTypes: () => ajax("/api/pcrs/partner-types"),
    getParticipantSizes: () => ajax("/api/pcrs/participant-sizes"),
    getProjectLocations: () => ajax("/api/pcrs/project-locations"),
    getCapitalUsageTypes: () => ajax("/api/pcrs/capital-usage-types"),
    getOverheadRateOptions: () => ajax("/api/pcrs/overhead-rate-options"),
  },
  projects: {
    get: params => ajaxJson(`/api/projects/${params.projectId}`),
    getAll: () => ajaxJson("/api/projects"),
    getAllAsDeveloper: () => ajaxJson("/api/projects/allAsDeveloper"),
    isProjectActive: params => ajaxJson(`/api/projects/project-active/${params.projectId}`),
  },
  projectContacts: {
    getAllByProjectId: params => ajaxJson(`/api/project-contacts?projectId=${params.projectId}`),
  },
  partners: {
    get: params => ajaxJson(`/api/partners/${params.partnerId}`),
    getAll: () => ajaxJson("/api/partners"),
    getAllByProjectId: params => ajaxJson(`/api/partners?projectId=${params.projectId}`),
    updatePartner: params =>
      ajaxPut(
        `/api/partners/${params.partnerId}?validateBankDetails=${params.validateBankDetails}&verifyBankDetails=${params.verifyBankDetails}`,
        params.partnerDto,
      ),
  },
  users: {
    getCurrent: () => ajaxJson("/api/users/current"),
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

const ajaxPostFile = <T>(url: string, document: DocumentUploadDto) => {
  const formData = new FormData();
  formData.append("attachment", (document.file as ClientFileWrapper).file);
  if (document.description) {
    formData.append("description", document.description.toString());
  }
  return ajaxPostFormData<T>(url, formData);
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

export { clientsideApiClient, apiClient };
