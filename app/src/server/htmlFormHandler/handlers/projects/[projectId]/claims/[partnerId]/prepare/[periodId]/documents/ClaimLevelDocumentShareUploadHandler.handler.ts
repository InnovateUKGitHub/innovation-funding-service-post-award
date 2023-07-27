import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import { claimLevelUpload, ClaimLevelUploadOutputs } from "@ui/zod/documentValidators.zod";
import express from "express";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";
import { ClaimDocumentsRoute } from "@ui/containers/pages/claims/documents/ClaimDocuments.page";
import { FormTypes } from "@ui/zod/FormTypes";

class ClaimLevelDocumentShareUploadHandler extends ZodFormHandlerBase<
  typeof claimLevelUpload,
  { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId }
> {
  constructor() {
    super({
      zod: claimLevelUpload,
      route: ClaimDocumentsRoute,
      forms: [FormTypes.ClaimLevelUpload],
      formIntlKeyPrefix: ["documents"],
    });
  }

  acceptFiles = true;

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<typeof claimLevelUpload>> {
    return {
      form: FormTypes.ClaimLevelUpload,
      files,
      description: input.description,
      projectId: input.projectId,
      partnerId: input.partnerId,
      periodId: parseInt(input.periodId, 10),
    };
  }

  protected async mapToRedirect() {
    return null;
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: ClaimLevelUploadOutputs;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(
      new UploadClaimDocumentsCommand(
        { partnerId: input.partnerId, periodId: input.periodId, projectId: input.projectId },
        input,
      ),
    );

    // TODO: Actually use Redux instead of a temporary array
    res.locals.preloadedReduxActions.push(
      messageSuccess(
        this.copy.getCopyString(x => x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length })),
      ),
    );
  }
}

export { ClaimLevelDocumentShareUploadHandler };
