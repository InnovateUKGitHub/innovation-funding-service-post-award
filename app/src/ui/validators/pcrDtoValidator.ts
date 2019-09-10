import { PCRDto, PCRItemDto, ProjectRole } from "@framework/dtos";
import { Results } from "../validation/results";
import * as Validation from "./common";
import { PCRItemStatus, PCRStatus } from "@framework/entities";

export class PCRDtoValidator extends Results<PCRDto> {
  constructor(model: PCRDto, private role: ProjectRole, private original: PCRDto, showValidationErrors: boolean) {
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

  private validateComments() {
    const isPM = !!(this.role & ProjectRole.ProjectManager);
    const isMO = !!(this.role & ProjectRole.MonitoringOfficer);
    if ((isPM && this.projectManagerCanEdit) || (isMO && this.monitoringOfficerCanEdit)) {
      return Validation.maxLength(this, this.model.comments, this.maxCommentsLength, `Comments can be a maximum of ${this.maxCommentsLength} characters`);
    }
    return Validation.isTrue(this, this.model.comments === this.original.comments, "Cannnot update comments");
  }

  private validateReasoningComments() {
    if (this.role & ProjectRole.ProjectManager && this.projectManagerCanEdit) {
      return Validation.maxLength(this, this.model.reasoningComments, this.maxCommentsLength, `Reasoning can be a maximum of ${this.maxCommentsLength} characters`);
    }
    return Validation.isTrue(this, this.model.reasoningComments === this.original.reasoningComments, "Cannnot update reasoning");
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
      () => Validation.permitedValues(this, this.model.status, permittedStatus, `Cannnot update status`),
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

  items = Validation.requiredChild(this, this.model.items, item => new PCRItemDtoValidator(item, this.role, this.model.status, this.showValidationErrors));

  comments = this.validateComments();
  status = this.validateStatus();
  reasoningComments = this.validateReasoningComments();
  reasoningStatus = this.validateReasonStatus();
}

export class PCRItemDtoValidator extends Results<PCRItemDto> {
  constructor(model: PCRItemDto, private role: ProjectRole, private pcrStatus: PCRStatus, showValidationErrors: boolean) {
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
}
