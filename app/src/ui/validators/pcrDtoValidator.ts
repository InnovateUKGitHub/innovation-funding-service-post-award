import { DateTime } from "luxon";
import { Result, Results } from "../validation";
import * as Validation from "./common";
import {
  PCRDto,
  PCRItemDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto,
  ProjectRole, TypedPcrItemDto
} from "@framework/dtos";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus } from "@framework/entities";

export class PCRDtoValidator extends Results<PCRDto> {

  constructor(model: PCRDto, private role: ProjectRole, private original: PCRDto, private readonly recordTypes: PCRItemTypeDto[], showValidationErrors: boolean) {
    super(model, showValidationErrors);
  }

  private projectManagerPermittedStatus = new Map<ProjectChangeRequestStatus, ProjectChangeRequestStatus[]>([
    [
      ProjectChangeRequestStatus.Draft,
      [
        ProjectChangeRequestStatus.Draft,
        ProjectChangeRequestStatus.SubmittedToMonitoringOfficer,
      ]
    ],
    [
      ProjectChangeRequestStatus.QueriedByMonitoringOfficer,
      [
        ProjectChangeRequestStatus.QueriedByMonitoringOfficer,
        ProjectChangeRequestStatus.SubmittedToMonitoringOfficer,
      ]
    ],
    [
      ProjectChangeRequestStatus.QueriedByInnovateUK,
      [
        ProjectChangeRequestStatus.QueriedByInnovateUK,
        ProjectChangeRequestStatus.SubmittedToInnovationLead,
      ]
    ]
  ]);

  private projectManagerCanEdit = !!this.projectManagerPermittedStatus.get(this.original.status);

  private monitoringOfficerPermittedStatus = new Map<ProjectChangeRequestStatus, ProjectChangeRequestStatus[]>([
    [
      ProjectChangeRequestStatus.SubmittedToMonitoringOfficer, [
        ProjectChangeRequestStatus.SubmittedToMonitoringOfficer,
        ProjectChangeRequestStatus.QueriedByMonitoringOfficer,
        ProjectChangeRequestStatus.SubmittedToInnovationLead,
      ]
    ]
  ]);

  private monitoringOfficerCanEdit = !!this.monitoringOfficerPermittedStatus.get(this.original.status);

  private maxCommentsLength = 1000;

  private validateComments(): Result {
    const isPM = !!(this.role & ProjectRole.ProjectManager);
    const isMO = !!(this.role & ProjectRole.MonitoringOfficer);
    if ((isPM && this.projectManagerCanEdit) || (isMO && this.monitoringOfficerCanEdit)) {
      const statusRequiringComments = isMO && this.monitoringOfficerCanEdit ? [ProjectChangeRequestStatus.SubmittedToInnovationLead, ProjectChangeRequestStatus.QueriedByMonitoringOfficer] : [];
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
        () => this.model.reasoningStatus === ProjectChangeRequestItemStatus.Complete ? Validation.required(this, this.model.reasoningComments, "Enter reasoning for the request") : Validation.valid(this),
        () => Validation.maxLength(this, this.model.reasoningComments, this.maxCommentsLength, `Reasoning can be a maximum of ${this.maxCommentsLength} characters`),
      );
    }
    return Validation.isTrue(this, this.model.reasoningComments === this.original.reasoningComments, "Cannot update reasoning");
  }

  private validateStatus() {

    const permittedStatus: ProjectChangeRequestStatus[] = [];
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
      ProjectChangeRequestItemStatus.ToDo,
      ProjectChangeRequestItemStatus.Incomplete,
      ProjectChangeRequestItemStatus.Complete,
    ];

    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.reasoningStatus, permittedStatus, "Invalid reasoning status"),
      () => Validation.isTrue(this, this.model.reasoningStatus === ProjectChangeRequestItemStatus.Complete || this.model.status === ProjectChangeRequestStatus.Draft, "Reasoning must be complete")
    );
  }

  private getItemValidator(item: TypedPcrItemDto) {
    const canEdit = (this.role & ProjectRole.ProjectManager) ? this.projectManagerCanEdit : false;
    switch (item.type) {
      case ProjectChangeRequestItemTypeEntity.TimeExtension:
        return new PCRTimeExtensionItemDtoValidator(item, canEdit, this.role, this.original.items.find(x => x.id === item.id) as PCRItemForTimeExtensionDto, this.model.status, this.recordTypes, this.showValidationErrors);
      case ProjectChangeRequestItemTypeEntity.ScopeChange:
        return new PCRScopeChangeItemDtoValidator(item, canEdit, this.role, this.original.items.find(x => x.id === item.id) as PCRItemForScopeChangeDto, this.model.status, this.recordTypes, this.showValidationErrors);
      case ProjectChangeRequestItemTypeEntity.AccountNameChange:
      case ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement:
      case ProjectChangeRequestItemTypeEntity.PartnerAddition:
      case ProjectChangeRequestItemTypeEntity.PartnerWithdrawal:
      case ProjectChangeRequestItemTypeEntity.ProjectSuspension:
      case ProjectChangeRequestItemTypeEntity.ProjectTermination:
      case ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement:
        return new PCRStandardItemDtoValidator(item, canEdit, this.role, this.original.items.find(x => x.id === item.id) as PCRStandardItemDto, this.model.status, this.recordTypes, this.showValidationErrors);
      default:
        throw new Error("PCR Type not implimented");
    }
  }

  public comments = this.validateComments();
  public status = this.validateStatus();
  public reasoningComments = this.validateReasoningComments();
  public reasoningStatus = this.validateReasonStatus();

  public items = Validation.requiredChild(
    this,
    this.model.items,
    item => this.getItemValidator(item),
    Validation.hasNoDuplicates(this, (this.model.items || []).map(x => x.type), "No duplicate items allowed"),
    "You must select at least one of the types"
  );
}

export class PCRBaseItemDtoValidator<T extends PCRItemDto> extends Results<T> {
  constructor(
    model: T,
    protected readonly canEdit: boolean,
    protected readonly role: ProjectRole,
    protected readonly original: T,
    protected readonly pcrStatus: ProjectChangeRequestStatus,
    protected readonly recordTypes: PCRItemTypeDto[],
    showValidationErrors: boolean
  ) {
    super(model, showValidationErrors);
  }

  private validateTypes() {
    return Validation.all(this,
      () => Validation.isTrue(this, this.recordTypes
        .map(x => x.type)
        .indexOf(this.model.type) >= 0, "Not a valid change request item"),
      // If role is not Project Manager then can not add new type
      () => Validation.isTrue(this, !!(this.role & ProjectRole.ProjectManager) || !!this.original, "Cannot add type")
    );
  }

  private validateStatus() {
    const permittedStatus = [
      ProjectChangeRequestItemStatus.ToDo,
      ProjectChangeRequestItemStatus.Incomplete,
      ProjectChangeRequestItemStatus.Complete,
    ];

    const statusWhenNotReqiredToBeComplete = [
      ProjectChangeRequestStatus.Draft,
      ProjectChangeRequestStatus.QueriedByInnovateUK,
      ProjectChangeRequestStatus.QueriedByMonitoringOfficer,
    ];

    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.status, permittedStatus, "Invalid status"),
      () => this.role & ProjectRole.ProjectManager ?
        Validation.isTrue(this,
          this.model.status === ProjectChangeRequestItemStatus.Complete || (statusWhenNotReqiredToBeComplete.indexOf(this.pcrStatus) >= 0)
          , `${this.model.typeName} must be complete`)
        : Validation.isTrue(this, !this.original || this.model.status === this.original.status, "Cannot update item status")
    );
  }

  public status = this.validateStatus();

  public type = this.validateTypes();
}

export class PCRStandardItemDtoValidator extends PCRBaseItemDtoValidator<PCRStandardItemDto> {

}

export class PCRTimeExtensionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForTimeExtensionDto> {
  private validateEndDate() {

    const isComplete = this.model.status === ProjectChangeRequestItemStatus.Complete;

    if (this.canEdit) {
      return Validation.all(this,
        () => isComplete ? Validation.required(this, this.model.projectEndDate, "Enter a project end date") : Validation.valid(this),
        () => Validation.isDate(this, this.model.projectEndDate, "Please enter a valid date"),
        () => this.model.projectEndDate ? Validation.isTrue(this, DateTime.fromJSDate(this.model.projectEndDate).plus({days: 1}).day === 1, "The date must be at the end of a month") : Validation.valid(this)
      );
    }
    else {
      return Validation.isTrue(this, (!this.model.projectEndDate && !this.original.projectEndDate) || (this.model.projectEndDate && this.original.projectEndDate && this.model.projectEndDate.getTime() === this.original.projectEndDate.getTime()), "Project end date cannot be changed.");
    }
  }

  projectEndDate = this.validateEndDate();
}

export class PCRScopeChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForScopeChangeDto> {
  private validateProjectSummary() {
    const isComplete = this.model.status === ProjectChangeRequestItemStatus.Complete;

    if (this.canEdit) {
      return isComplete ? Validation.required(this, this.model.projectSummary, "Enter a project summary") : Validation.valid(this);
    }
    return Validation.isTrue(this, (this.model.projectSummary === this.original.projectSummary), "Project summary cannot be changed.");
  }

  private validatePublicDescription() {
    const isComplete = this.model.status === ProjectChangeRequestItemStatus.Complete;

    if (this.canEdit) {
      return isComplete ? Validation.required(this, this.model.publicDescription, "Enter a public description") : Validation.valid(this);
    }
    return Validation.isTrue(this, (this.model.publicDescription === this.original.publicDescription), "Public description cannot be changed.");
  }

  projectSummary = this.validateProjectSummary();
  publicDescription = this.validatePublicDescription();
}
