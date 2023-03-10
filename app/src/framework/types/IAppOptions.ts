export interface IAppOptions {
  readonly maxFileSize: number;
  readonly maxUploadFileCount: number;
  /**
   * @deprecated since ACC-7394
   */
  readonly permittedFileTypes: readonly string[];
  readonly permittedTypes: Record<string, readonly string[]>;
  readonly bankCheckValidationRetries: number;
  readonly bankCheckAddressScorePass: number;
  readonly bankCheckCompanyNameScorePass: number;
  readonly standardOverheadRate: number;
  readonly numberOfProjectsToSearch: number;
  readonly maxClaimLineItems: number;
  readonly nonJsMaxClaimLineItems: number;
}
