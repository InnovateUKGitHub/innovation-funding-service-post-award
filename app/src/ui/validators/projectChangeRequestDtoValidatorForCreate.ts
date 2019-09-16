import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos";
import { Results } from "../validation/results";
import * as Validation from "./common";
import { PCRItemStatus, PCRStatus } from "@framework/entities";

export class ProjectChangeRequestDtoValidatorForCreate extends Results<PCRDto> {
  constructor(
    public readonly model: PCRDto,
    private readonly recordTypes: PCRItemTypeDto[],
    public readonly showValidationErrors: boolean) {
    super(model, showValidationErrors);
  }

  items = Validation.requiredChild(
    this,
    this.model.items,
    q => new ProjectChangeRequestItemValidatorForCreate(q, this.showValidationErrors, this.recordTypes),
    Validation.hasNoDuplicates(this, (this.model.items || []).map(x => x.type), "No duplicate items allowed"),
    "You must select at least one of the types"
  );

  status = Validation.isTrue(this, this.model.status === PCRStatus.Draft, "Can only create a new Draft PCR");
  reasoningStatus = Validation.isTrue(this, this.model.reasoningStatus === PCRItemStatus.ToDo, "Reasoning status should be To Do");
}

class ProjectChangeRequestItemValidatorForCreate extends Results<PCRItemDto> {
  constructor(
    public readonly model: PCRItemDto,
    public readonly showValidationErrors: boolean,
    private readonly recordTypes: PCRItemTypeDto[]) {
    super(model, showValidationErrors);
  }

  type = Validation.isTrue(this, this.recordTypes
    .map(x => x.recordTypeId)
    .indexOf(this.model.recordTypeId) >= 0, "Not a valid change request item");

  status = Validation.isTrue(this, this.model.status === PCRItemStatus.ToDo, "Status should be To Do");
}
