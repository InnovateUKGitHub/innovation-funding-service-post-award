import { PCRItemType, PCRItemHiddenReason, pcrItemTypes, IMetaValue } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { RecordType } from "@framework/entities/recordType";
import { IContext } from "@framework/types/IContext";
import { IConfig } from "@framework/types/IConfig";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllRecordTypesQuery } from "../general/getAllRecordTypesQuery";

export class GetAllPCRItemTypesQuery extends AuthorisedAsyncQueryBase<PCRItemTypeDto[]> {
  public readonly runnableName: string = "GetAllPCRItemTypesQuery";
  public standalonePcrTypes = [PCRItemType.ManageTeamMembers];

  constructor(public readonly projectId: ProjectId) {
    super();
  }

  protected async run(context: IContext): Promise<PCRItemTypeDto[]> {
    const recordTypes = await context.runQuery(new GetAllRecordTypesQuery());
    const pcrRecordTypes = recordTypes.filter(x => x.parent === "Acc_ProjectChangeRequest__c");

    return pcrItemTypes.map<PCRItemTypeDto>(metaInfo => ({
      type: metaInfo.type,
      displayName: metaInfo.displayName || metaInfo.typeName,
      enabled: this.getEnabledStatus(metaInfo, context.config),
      hidden: false,
      hiddenReason: PCRItemHiddenReason.None,
      recordTypeId: this.findRecordType(metaInfo.typeName, pcrRecordTypes),
      files: this.getPCRFiles(metaInfo.files),
      standalone: this.standalonePcrTypes.includes(metaInfo.type),
    }));
  }

  private getPCRFiles(metaInfoFiles: IMetaValue["files"]): PCRItemTypeDto["files"] {
    if (!metaInfoFiles?.length) return [];

    return metaInfoFiles.map(file => ({
      name: file,
      relativeUrl: `/ifspa-assets/pcr_templates/${file}`,
    }));
  }

  private getEnabledStatus(metaInfo: IMetaValue, config: IConfig): boolean {
    if (metaInfo.deprecated) return false;

    // TODO: Raise ticket to remove this... Currently we have no matching competitions for this PCRItemType
    if (metaInfo.type === PCRItemType.PeriodLengthChange) {
      return config.features.changePeriodLengthWorkflow;
    }

    return true;
  }

  private findRecordType(typeName: string, recordTypes: RecordType[]): string {
    const recordType = recordTypes.find(y => y.type === typeName);
    return recordType?.id || "Unknown";
  }
}
