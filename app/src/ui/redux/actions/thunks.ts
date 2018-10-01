import { conditionalLoad } from "./dataLoad";
import { ApiClient } from "../../../shared/apiClient";

export function loadContacts() {
  return conditionalLoad(
    "all",
    "contacts",
    () => ApiClient.contacts.getAll()
  );
}

export function loadContact(id: string) {
  return conditionalLoad(
    id,
    "contact",
    () => ApiClient.contacts.get(id)
  );
}

export function loadClaimsForPartner(partnerId: string) {
  return conditionalLoad(
    partnerId,
    "claims",
    () => ApiClient.claims.getAllByPartnerId(partnerId)
  );
}

export function loadClaimLineItemsForCategory(partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    partnerId,
    "claimLineItems",
    () => ApiClient.claimLineItems.getAllForCategory(partnerId, costCategoryId, periodId)
  );
}

export function loadClaimDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    partnerId + "_" + periodId,
    "claimDetails",
    () => ApiClient.claimDetails.getAllByPartnerId(partnerId, periodId)
  );
}

export function loadProject(id: string) {
  return conditionalLoad(
    id,
    "project",
    () => {
      return ApiClient.projects.get(id);
    }
  );
}

export function loadPartner(id: string) {
  return conditionalLoad(
    id,
    "partner",
    () => {
      return ApiClient.partners.get(id);
    }
  );
}

export function loadProjects() {
  return conditionalLoad(
    "all",
    "projects",
    () => ApiClient.projects.getAll()
  );
}

export function loadPatnersForProject(projectId: string) {
  return conditionalLoad(
    projectId,
    "partners",
    () => ApiClient.partners.getAllByProjectId(projectId)
  );
}

export function loadContactsForProject(projectId: string) {
  return conditionalLoad(
    projectId,
    "projectContacts",
    () => ApiClient.projectContacts.getAllByProjectId(projectId)
  );
}

export function loadCostCategories() {
  return conditionalLoad(
    "all",
    "costCategories",
    () => ApiClient.costCategories.getAll()
  );
}

export function loadClaim(claimId: string) {
  return conditionalLoad(
    claimId,
    "claim",
    () => ApiClient.claims.getById(claimId)
  );
}
