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

export function loadClaimLineItemsForCategory(claimId: string, costCategoryId: number) {
  return conditionalLoad(
    claimId,
    "claimLineItems",
    () => ApiClient.claimLineItems.getAllForClaimByCategoryId(claimId, costCategoryId)
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

export function loadClaimCosts(claimId: string) {
  return conditionalLoad(
    claimId,
    "claimCosts",
    () => ApiClient.claimCosts.getAllForClaim(claimId)
  );
}

export function loadClaim(claimId: string) {
  return conditionalLoad(
    claimId,
    "claim",
    () => ApiClient.claims.getById(claimId)
  );
}
