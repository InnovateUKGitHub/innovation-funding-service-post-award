export interface IAppOptions {
  readonly maxFileSize: number;
  readonly maxUploadFileCount: number;
  readonly permittedFileTypes: string[];
  readonly bankCheckValidationRetries: number;
  readonly bankCheckAddressScorePass: number;
  readonly bankCheckCompanyNameScorePass: number;
  readonly standardOverheadRate: number;
  readonly numberOfProjectsToSearch: number;
}
