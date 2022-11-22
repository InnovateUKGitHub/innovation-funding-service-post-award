export interface DeveloperUserButtonChange {
  buttonUser: string;
  projectId: string;
  isReset: false;
  isSearch: false;
  currentUrl?: string;
}

export interface DeveloperUserInputChange {
  user: string;
  isReset: false;
  isSearch: false;
  currentUrl?: string;
}

export interface DeveloperUserReset {
  isReset: true;
  isSearch: false;
  currentUrl?: string;
}

export interface DeveloperUserSearch {
  projectId: string;
  isReset: false;
  isSearch: true;
  currentUrl?: string;
}

export type DeveloperUserChangeDto =
  | DeveloperUserButtonChange
  | DeveloperUserInputChange
  | DeveloperUserReset
  | DeveloperUserSearch;
