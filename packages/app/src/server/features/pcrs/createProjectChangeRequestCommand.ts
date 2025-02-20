import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PCRItemTypeDto, CreatePcrDto } from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestItemForCreateEntity } from "@framework/entities/projectChangeRequest";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  pcrCreateSchema,
  PcrCreateSchemaType,
  pcrModifyErrorMap,
} from "@ui/pages/pcrs/modifyOptions/pcrModifyOptions.zod";
import { z } from "zod";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class CreateProjectChangeRequestCommand extends ZodAuthorisedAsyncCommandBase<
  PcrId,
  PcrCreateSchemaType,
  CreatePcrDto
> {
  public readonly runnableName: string = "CreateProjectChangeRequestCommand";
  protected readonly projectId: ProjectId;
  protected readonly pcrId: PcrId | null | undefined;
  protected readonly dto: CreatePcrDto;
  private readonly form: FormTypes.ProjectChangeRequestCreate | FormTypes.ProjectChangeRequestUpdateTypes;

  constructor({
    projectId,
    projectChangeRequest,
    form,
    pcrId,
  }: {
    projectId: ProjectId;
    projectChangeRequest: CreatePcrDto;
    form: FormTypes.ProjectChangeRequestCreate | FormTypes.ProjectChangeRequestUpdateTypes;
    pcrId: PcrId | null | undefined;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = this.pcrId;
    this.dto = projectChangeRequest;
    this.form = form;
    this.pcrId = pcrId;
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.ProjectManager);
  }

  protected async getZodSchema() {
    return {
      schema: pcrCreateSchema,
      errorMap: pcrModifyErrorMap,
    };
  }

  protected async mapToZod(): Promise<z.input<PcrCreateSchemaType>> {
    return {
      form: this.form,
      types: this.dto.types,
      numberOfPartners: this.dto.numberOfPartners,
      pcrItemInfo: this.dto.pcrItemInfo,
      currentPcrItems: this.dto.currentPcrItems,
    };
  }

  protected async runRepositoryCommands(context: IContext, validatedData: z.output<PcrCreateSchemaType>) {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));

    if (this.pcrId) {
      await context.repositories.projectChangeRequests.addPcrTypes({
        id: this.pcrId,
        projectId: this.projectId,
        items: validatedData.types.map(x => this.mapItem(x, itemTypes)),
      });
      return this.pcrId;
    } else {
      const newPCR = {
        projectId: this.projectId,
        manageTeamMemberStatus: PCRStatus.Unknown,
        status: PCRStatus.DraftWithProjectManager,
        reasoningStatus: PCRItemStatus.ToDo,
        items: validatedData.types.map(x => this.mapItem(x, itemTypes)),
      };
      const pcrId = await context.repositories.projectChangeRequests.createProjectChangeRequestHeader(newPCR);
      await Promise.allSettled([
        context.repositories.projectChangeRequestStatusChange.createStatusChange({
          Acc_ProjectChangeRequest__c: pcrId,
          Acc_ExternalComment__c: "",
          Acc_ParticipantVisibility__c: true,
        }),
        context.repositories.projectChangeRequests.insertItems(pcrId, newPCR.items),
      ]);

      return pcrId;
    }
  }

  private mapItem(type: PCRItemType, itemTypes: PCRItemTypeDto[]): ProjectChangeRequestItemForCreateEntity {
    const matchedItem = itemTypes.find(t => t.type === type);
    if (!matchedItem) throw new Error(`cannot find item matching ${type}`);
    return {
      projectId: this.projectId,
      recordTypeId: matchedItem.recordTypeId,
      developerRecordTypeName: matchedItem.developerRecordTypeName,
      status: PCRItemStatus.ToDo,
    };
  }
}
