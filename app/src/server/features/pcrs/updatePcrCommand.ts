import { BadRequestError, CommandBase, ValidationError } from "../common";
import { PCRDto } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { IContext } from "@framework/types";

export class UpdatePCRCommand extends CommandBase<boolean> {
  constructor(private projectId: string, private id: string, private pcr: PCRDto) {
    super();
  }

  protected async Run(context: IContext): Promise<boolean> {
    if(this.projectId !== this.pcr.projectId || this.id !== this.pcr.id) {
      throw new BadRequestError();
    }

    const original = await context.repositories.pcrs.getById(this.pcr.projectId, this.pcr.id);

    const validationResult = new PCRDtoValidator(this.pcr, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    original.comments = this.pcr.comments;
    original.status = this.pcr.status;
    original.reasoning = this.pcr.reasoningComments;
    original.reasoningStatus = this.pcr.reasoningStatus;

    await context.repositories.pcrs.updatePcr(original);

    return true;
  }
}
