import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import {
  ClaimDetailLevelUploadSchemaType,
  documentsErrorMap,
  getClaimDetailLevelUpload,
} from "@ui/zod/documentValidators.zod";
import express from "express";
import {
  ClaimDetailDocumentsRoute,
  ClaimDetailDocumentsPageParams,
} from "@ui/containers/pages/claims/claimDetailDocuments.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { UploadClaimDetailDocumentCommand } from "@server/features/documents/uploadClaimDetailDocument";

class ClaimDetailLevelDocumentShareUploadHandler extends ZodFormHandlerBase<
  ClaimDetailLevelUploadSchemaType,
  ClaimDetailDocumentsPageParams
> {
  constructor() {
    super({
      routes: [ClaimDetailDocumentsRoute],
      forms: [FormTypes.ClaimDetailLevelUpload],
    });
  }

  public readonly acceptFiles = true;

  protected async getZodSchema({ params, context }: { params: ClaimDetailDocumentsPageParams; context: IContext }) {
    const project = await context.runQuery(new GetByIdQuery(params.projectId));

    return {
      schema: getClaimDetailLevelUpload({ config: configuration.options, project }),
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<ClaimDetailLevelUploadSchemaType>> {
    return {
      form: FormTypes.ClaimDetailLevelUpload,
      files,
      description: input.description,
      projectId: input.projectId,
      partnerId: input.partnerId,
      periodId: parseInt(input.periodId, 10),
      costCategoryId: input.costCategoryId,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<ClaimDetailLevelUploadSchemaType>;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(
      new UploadClaimDetailDocumentCommand(
        {
          partnerId: input.partnerId,
          periodId: input.periodId,
          projectId: input.projectId,
          costCategoryId: input.costCategoryId,
        },
        input,
      ),
    );

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}

export { ClaimDetailLevelDocumentShareUploadHandler };
