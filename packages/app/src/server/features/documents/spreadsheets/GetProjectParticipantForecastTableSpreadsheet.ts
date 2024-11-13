import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ForecastTableSpreadsheet } from "@framework/documents/spreadsheets/ForecastTableSpreadsheet";
import { Spreadsheet, SpreadsheetFormat } from "@framework/documents/spreadsheets/Spreadsheet";
import { DocumentDto } from "@framework/dtos/documentDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "@server/features/common/queryBase";
import { GetForecastTableDataInputPropsQuery } from "@server/features/forecastDetails/GetForecastTableDataInputPropsQuery";
import { mapToForecastTableDto } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export class GetProjectParticipantForecastTableSpreadsheet extends AuthorisedAsyncQueryBase<DocumentDto | null> {
  public readonly runnableName: string = "GetProjectParticipantForecastTableSpreadsheet";

  private readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  private readonly format: SpreadsheetFormat;

  constructor({
    projectId,
    partnerId,
    format,
  }: {
    projectId: ProjectId;
    partnerId: PartnerId;
    format: SpreadsheetFormat;
  }) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.format = format;
  }

  async accessControl(auth: Authorisation) {
    return (
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.ProjectManager) ||
      auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer)
    );
  }

  protected async run(context: IContext): Promise<DocumentDto | null> {
    const data = await context.runQuery(
      new GetForecastTableDataInputPropsQuery({
        projectId: this.projectId,
        partnerId: this.partnerId,
      }),
    );

    const tableData = mapToForecastTableDto(data);
    const metadata = Spreadsheet.metadata[this.format];

    const spreadsheet = new ForecastTableSpreadsheet({
      tableData,
      copy: context.internationalisation.copy,
    });

    const fileName = spreadsheet.getFilename();
    const buffer = await spreadsheet.export(this.format);
    const blob = new Blob([buffer], { type: metadata.mimeType });

    return {
      contentLength: buffer.byteLength,
      stream: Readable.fromWeb(blob.stream() as ReadableStream),
      fileName: `${fileName}.${metadata.extension}`,
      fileType: metadata.mimeType,
    };
  }
}
