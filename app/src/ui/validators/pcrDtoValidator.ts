import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectRole } from "@framework/dtos";
import { Result, Results } from "../validation";
import * as Validation from "./common";
import { PCRItemStatus, PCRStatus } from "@framework/entities";

export class PCRDtoValidator extends Results<PCRDto> {
  constructor(model: PCRDto, private role: ProjectRole, private original: PCRDto, private readonly recordTypes: PCRItemTypeDto[], showValidationErrors: boolean) {
    super(model, showValidationErrors);
  }

  private projectManagerPermittedStatus = new Map<PCRStatus, PCRStatus[]>([
    [
      PCRStatus.Draft,
      [
        PCRStatus.Draft,
        PCRStatus.SubmittedToMonitoringOfficer,
      ]
    ],
    [
      PCRStatus.QueriedByMonitoringOfficer,
      [
        PCRStatus.QueriedByMonitoringOfficer,
        PCRStatus.SubmittedToMonitoringOfficer,
      ]
    ],
    [
      PCRStatus.QueriedByInnovateUK,
      [
        PCRStatus.QueriedByInnovateUK,
        PCRStatus.SubmittedToInnovationLead,
      ]
    ]
  ]);

  private projectManagerCanEdit = !!this.projectManagerPermittedStatus.get(this.original.status);

  private monitoringOfficerPermittedStatus = new Map<PCRStatus, PCRStatus[]>([
    [
      PCRStatus.SubmittedToMonitoringOfficer, [
        PCRStatus.SubmittedToMonitoringOfficer,
        PCRStatus.QueriedByMonitoringOfficer,
        PCRStatus.SubmittedToInnovationLead,
      ]
    ]
  ]);

  private monitoringOfficerCanEdit = !!this.monitoringOfficerPermittedStatus.get(this.original.status);

  private maxCommentsLength = 1000;

  private validateComments(): Result {
    const isPM = !!(this.role & ProjectRole.ProjectManager);
    const isMO = !!(this.role & ProjectRole.MonitoringOfficer);
    if ((isPM && this.projectManagerCanEdit) || (isMO && this.monitoringOfficerCanEdit)) {
      const statusRequiringComments = isMO ? [PCRStatus.SubmittedToInnovationLead, PCRStatus.QueriedByMonitoringOfficer] : [];
      return Validation.all(this,
        () => statusRequiringComments.indexOf(this.model.status) >= 0 ? Validation.required(this, this.model.comments, "Comments are required") : Validation.valid(this),
        () => Validation.maxLength(this, this.model.comments, this.maxCommentsLength, `Comments can be a maximum of ${this.maxCommentsLength} characters`),
      );
    }
    return Validation.isTrue(this, this.model.comments === this.original.comments, "Cannot update comments");
  }

  private validateReasoningComments() {
    if (this.role & ProjectRole.ProjectManager && this.projectManagerCanEdit) {
      return Validation.all(this,
        () => this.model.reasoningStatus === PCRItemStatus.Complete ? Validation.required(this, this.model.reasoningComments, "Reasoning is required") : Validation.valid(this),
        () => Validation.maxLength(this, this.model.reasoningComments, this.maxCommentsLength, `Reasoning can be a maximum of ${this.maxCommentsLength} characters`),
      );
    }
    return Validation.isTrue(this, this.model.reasoningComments === this.original.reasoningComments, "Cannot update reasoning");
  }

  private validateStatus() {

    const permittedStatus: PCRStatus[] = [];
    if (this.role & ProjectRole.ProjectManager) {
      permittedStatus.push(...this.projectManagerPermittedStatus.get(this.original.status) || []);
    }

    if (this.role & ProjectRole.MonitoringOfficer) {
      permittedStatus.push(...this.monitoringOfficerPermittedStatus.get(this.original.status) || []);
    }

    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.status, permittedStatus, `Set a valid status`),
    );
  }

  private validateReasonStatus() {
    const permittedStatus = [
      PCRItemStatus.ToDo,
      PCRItemStatus.Incomplete,
      PCRItemStatus.Complete,
    ];

    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.reasoningStatus, permittedStatus, "Invalid reasoning status"),
      () => Validation.isTrue(this, this.model.reasoningStatus === PCRItemStatus.Complete || this.model.status === PCRStatus.Draft, "Reasoning must be complete")
    );
  }

  items = Validation.requiredChild(
    this,
    this.model.items,
      item => new PCRItemDtoValidator(item, this.role, this.model.status, this.recordTypes, this.showValidationErrors),
    Validation.hasNoDuplicates(this, (this.model.items || []).map(x => x.type), "No duplicate items allowed"),
   "You must select at least one of the types"
  );

  comments = this.validateComments();
  status = this.validateStatus();
  reasoningComments = this.validateReasoningComments();
  reasoningStatus = this.validateReasonStatus();
}

export class PCRItemDtoValidator extends Results<PCRItemDto> {
  constructor(model: PCRItemDto, private role: ProjectRole, private pcrStatus: PCRStatus, private readonly recordTypes: PCRItemTypeDto[], showValidationErrors: boolean) {
    super(model, showValidationErrors);
  }

  validateStatus() {
    const permittedStatus = [
      PCRItemStatus.ToDo,
      PCRItemStatus.Incomplete,
      PCRItemStatus.Complete,
    ];

    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.status, permittedStatus, "Invalid status"),
      () => Validation.isTrue(this, this.model.status === PCRItemStatus.Complete || this.pcrStatus === PCRStatus.Draft, `${this.model.typeName} must be complete`)
    );
  }

  status = this.validateStatus();

  type = Validation.isTrue(this, this.recordTypes
    .map(x => x.type)
    .indexOf(this.model.type) >= 0, "Not a valid change request item");
}
