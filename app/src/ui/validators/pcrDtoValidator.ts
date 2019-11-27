import { DateTime } from "luxon";
import { Result, Results } from "../validation";
import * as Validation from "./common";
import {
  PartnerDto,
  PCRDto,
  PCRItemDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto,
  ProjectRole
} from "@framework/dtos";
import {
  PCRItemStatus,
  PCRItemType,
  PCRStatus
} from "@framework/constants";

export class PCRDtoValidator extends Results<PCRDto> {

  constructor(model: PCRDto, private role: ProjectRole, private readonly recordTypes: PCRItemTypeDto[], showValidationErrors: boolean, private original?: PCRDto, private partners?: PartnerDto[]) {
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

  private projectManagerCanEdit = !this.original || !!this.projectManagerPermittedStatus.get(this.original.status);

  private monitoringOfficerPermittedStatus = new Map<PCRStatus, PCRStatus[]>([
    [
      PCRStatus.SubmittedToMonitoringOfficer, [
        PCRStatus.SubmittedToMonitoringOfficer,
        PCRStatus.QueriedByMonitoringOfficer,
        PCRStatus.SubmittedToInnovationLead,
      ]
    ]
  ]);

  private monitoringOfficerCanEdit = this.original && !!this.monitoringOfficerPermittedStatus.get(this.original.status);

  private maxCommentsLength = 1000;

  private validateComments(): Result {
    const isPM = !!(this.role & ProjectRole.ProjectManager);
    const isMO = !!(this.role & ProjectRole.MonitoringOfficer);
    if ((isPM && this.projectManagerCanEdit) || (isMO && this.monitoringOfficerCanEdit)) {
      const statusRequiringComments = isMO && this.monitoringOfficerCanEdit ? [PCRStatus.SubmittedToInnovationLead, PCRStatus.QueriedByMonitoringOfficer] : [];
      return Validation.all(this,
        () => statusRequiringComments.indexOf(this.model.status) >= 0 ? Validation.required(this, this.model.comments, "Comments are required") : Validation.valid(this),
        () => Validation.maxLength(this, this.model.comments, this.maxCommentsLength, `Comments can be a maximum of ${this.maxCommentsLength} characters`),
      );
    }

    if (!this.original) {
      return Validation.isTrue(this, !this.model.comments, "Cannot update comments");
    }

    return Validation.isTrue(this, this.model.comments === this.original.comments, "Cannot update comments");
  }

  private validateReasoningComments() {
    if (this.role & ProjectRole.ProjectManager && this.projectManagerCanEdit) {
      return Validation.all(this,
        () => this.model.reasoningStatus === PCRItemStatus.Complete ? Validation.required(this, this.model.reasoningComments, "Enter reasoning for the request") : Validation.valid(this),
        () => Validation.maxLength(this, this.model.reasoningComments, this.maxCommentsLength, `Reasoning can be a maximum of ${this.maxCommentsLength} characters`),
      );
    }

    if (!this.original) {
      return Validation.isTrue(this, !this.model.reasoningComments, "Cannot update reasoning");
    }

    return Validation.isTrue(this, this.model.reasoningComments === this.original.reasoningComments, "Cannot update reasoning");
  }

  private validateStatus() {

    const permittedStatus: PCRStatus[] = [];

    if (this.role & ProjectRole.ProjectManager) {
      if (!this.original) {
        permittedStatus.push(PCRStatus.Draft);
      } else {
        permittedStatus.push(...this.projectManagerPermittedStatus.get(this.original.status) || []);
      }
    }

    if (this.role & ProjectRole.MonitoringOfficer && this.original) {
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

    const preparePcrStatus = [PCRStatus.Draft, PCRStatus.QueriedByMonitoringOfficer, PCRStatus.QueriedByInnovateUK];
    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.reasoningStatus, permittedStatus, "Invalid reasoning status"),
      () => Validation.isTrue(this, this.model.reasoningStatus === PCRItemStatus.Complete || preparePcrStatus.indexOf(this.model.status) >= 0, "Reasoning must be complete")
    );
  }

  private getItemValidator(item: PCRItemDto) {
    const canEdit = (this.role & ProjectRole.ProjectManager) ? this.projectManagerCanEdit : false;
    const originalItem = this.original && this.original.items.find(x => x.id === item.id);
    switch (item.type) {
      case PCRItemType.TimeExtension:
        return new PCRTimeExtensionItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors,originalItem as PCRItemForTimeExtensionDto);
      case PCRItemType.ScopeChange:
        return new PCRScopeChangeItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForScopeChangeDto);
      case PCRItemType.ProjectSuspension:
        return new PCRProjectSuspensionItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForProjectSuspensionDto);
      case PCRItemType.ProjectTermination:
        return new PCRProjectTerminationItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForProjectTerminationDto);
      case PCRItemType.AccountNameChange:
        return new PCRAccountNameChangeItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, this.partners, originalItem as PCRItemForAccountNameChangeDto);
      case PCRItemType.MultiplePartnerFinancialVirement:
      case PCRItemType.PartnerAddition:
      case PCRItemType.PartnerWithdrawal:
      case PCRItemType.SinglePartnerFinancialVirement:
        return new PCRStandardItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRStandardItemDto);
      default:
        throw new Error("PCR Type not implemented");
    }
  }

  public comments = this.validateComments();
  public status = this.validateStatus();
  public reasoningComments = this.validateReasoningComments();
  public reasoningStatus = this.validateReasonStatus();

  public items = Validation.child(
    this,
    this.model.items,
    item => this.getItemValidator(item),
    children => children.all(
      () => children.required("You must select at least one of the types"),
      () => children.hasNoDuplicates(x => x.type, "No duplicate items allowed")
    )
  );
}

export class PCRBaseItemDtoValidator<T extends PCRItemDto> extends Results<T> {
  constructor(
    model: T,
    protected readonly canEdit: boolean,
    protected readonly role: ProjectRole,
    protected readonly pcrStatus: PCRStatus,
    protected readonly recordTypes: PCRItemTypeDto[],
    showValidationErrors: boolean,
    protected readonly original?: T,
  ) {
    super(model, showValidationErrors);
  }

  private validateTypes() {
    return Validation.all(this,
      () => Validation.isTrue(this, this.recordTypes.map(x => x.type).indexOf(this.model.type) >= 0, "Not a valid change request item"),
      () => Validation.isTrue(this, !!this.original || this.recordTypes.find(x => x.type === this.model.type)!.enabled, "Not a valid change request item"),
      // If role is not Project Manager then can not add new type
      () => Validation.isTrue(this, !!(this.role & ProjectRole.ProjectManager) || !!this.original, "Cannot add type")
    );
  }

  private validateStatus() {
    const permittedStatus = [
      PCRItemStatus.ToDo,
      PCRItemStatus.Incomplete,
      PCRItemStatus.Complete,
    ];

    const statusWhenNotRequiredToBeComplete = [
      PCRStatus.Draft,
      PCRStatus.QueriedByInnovateUK,
      PCRStatus.QueriedByMonitoringOfficer,
    ];

    return Validation.all(this,
      () => Validation.permitedValues(this, this.model.status, permittedStatus, "Invalid status"),
      () => this.role & ProjectRole.ProjectManager ?
        Validation.isTrue(this,
          this.model.status === PCRItemStatus.Complete || (statusWhenNotRequiredToBeComplete.indexOf(this.pcrStatus) >= 0)
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
  private validateAdditionalMonths() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.additionalMonths, this.original && this.original.additionalMonths, "Project duration cannot be changed.");
    }

    const isComplete = this.model.status === PCRItemStatus.Complete;
    const hasValue = this.model.additionalMonths || this.model.additionalMonths === 0;

    return Validation.all(this,
      () => isComplete ? Validation.required(this, this.model.additionalMonths , "Please enter the number of months you want to extend your project by") : Validation.valid(this),
      () => Validation.number(this, this.model.additionalMonths , "Please enter a number of months you want to extend your project by"),
      () => hasValue ? Validation.isTrue(this, this.model.additionalMonths! > 0, "Please enter a number that increases the project duration") : Validation.valid(this),
      () => hasValue ? Validation.isTrue(this, Number.isInteger(this.model.additionalMonths!), "Please enter a whole number of months") : Validation.valid(this)
    );
  }

  additionalMonths = this.validateAdditionalMonths();
}

export class PCRProjectTerminationItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForProjectTerminationDto> {

}

export class PCRProjectSuspensionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForProjectSuspensionDto> {

  private isComplete = this.model.status === PCRItemStatus.Complete;

  private validateSuspensionStartDate() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.suspensionStartDate, this.original && this.original.suspensionStartDate, "Project suspension start date cannot be changed.");
    }

    return Validation.all(this,
      () => this.isComplete ? Validation.required(this, this.model.suspensionStartDate, "Enter a project suspension start date") : Validation.valid(this),
      () => Validation.isDate(this, this.model.suspensionStartDate, "Please enter a valid suspension start date"),
      () => this.model.suspensionStartDate ? Validation.isTrue(this, DateTime.fromJSDate(this.model.suspensionStartDate).day === 1, "The date must be at the start of the month") : Validation.valid(this)
    );
  }

  private validateSuspensionEndDate() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.suspensionEndDate, this.original && this.original.suspensionEndDate, "Project suspension end date cannot be changed.");
    }
    return Validation.all(this,
      () => Validation.isDate(this, this.model.suspensionEndDate, "Please enter a valid suspension end date"),
      () => this.model.suspensionEndDate ? Validation.isTrue(this, DateTime.fromJSDate(this.model.suspensionEndDate).plus({days: 1}).day === 1, "The date must be at the end of the month") : Validation.valid(this)
    );
  }

  suspensionStartDate = this.validateSuspensionStartDate();
  suspensionEndDate = this.validateSuspensionEndDate();
}

export class PCRScopeChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForScopeChangeDto> {
  private validateProjectSummary() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.projectSummary, this.original && this.original.projectSummary, "Project summary cannot be changed.");
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return isComplete ? Validation.required(this, this.model.projectSummary, "Enter a project summary") : Validation.valid(this);
  }

  private validatePublicDescription() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.publicDescription, this.original && this.original.publicDescription, "Public description cannot be changed.");

    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return isComplete ? Validation.required(this, this.model.publicDescription, "Enter a public description") : Validation.valid(this);
  }

  projectSummary = this.validateProjectSummary();
  publicDescription = this.validatePublicDescription();
}

export class PCRAccountNameChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForAccountNameChangeDto> {

  constructor(
    model: PCRItemForAccountNameChangeDto,
    protected readonly canEdit: boolean,
    protected readonly role: ProjectRole,
    protected readonly pcrStatus: PCRStatus,
    protected readonly recordTypes: PCRItemTypeDto[],
    showValidationErrors: boolean,
    protected readonly partners?: PartnerDto[],
    protected readonly original?: PCRItemForAccountNameChangeDto
  ) {
    super(model, canEdit, role, pcrStatus, recordTypes, showValidationErrors, original);
  }

  private validateAccountName() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.accountName, this.original && this.original.accountName, "Partner name cannot be changed.");
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return isComplete ? Validation.required(this, this.model.accountName, "Enter a new partner name") : Validation.valid(this);
  }

  private validatePartnerId() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.partnerId, this.original && this.original.partnerId, "Partner cannot be changed.");
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(this,
      () => isComplete ? Validation.required(this, this.model.partnerId, "Select partner to change") : Validation.valid(this),
      () => this.partners && this.model.partnerId ? Validation.permitedValues(this, this.model.partnerId, this.partners.map(x => x.id), "Invalid partner for project") : Validation.valid(this)
    );
  }

  accountName = this.validateAccountName();
  partnerId = this.validatePartnerId();
}
