import { DateTime } from "luxon";
import { Result, Results } from "../validation";
import * as Validation from "./common";
import {
  PartnerDto,
  PCRDto,
  PCRItemDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForPeriodLengthChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto,
  ProjectDto,
  ProjectRole
} from "@framework/dtos";
import { PCRItemStatus, PCRItemType, PCRPartnerType, PCRProjectRole, PCRStatus } from "@framework/constants";
import { isNumber, periodInProject } from "@framework/util";
import { PCRSpendProfileDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

export class PCRDtoValidator extends Results<PCRDto> {

  constructor(
    model: PCRDto,
    private role: ProjectRole,
    private readonly recordTypes: PCRItemTypeDto[],
    showValidationErrors: boolean,
    private readonly project: ProjectDto,
    private featureFlags: IFeatureFlags,
    private original?: PCRDto,
    private partners?: PartnerDto[]
  ) {
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
        PCRStatus.SubmittedToInnovateUK,
      ]
    ]
  ]);

  private projectManagerCanEdit = !this.original || !!this.projectManagerPermittedStatus.get(this.original.status);

  private monitoringOfficerPermittedStatus = new Map<PCRStatus, PCRStatus[]>([
    [
      PCRStatus.SubmittedToMonitoringOfficer, [
        PCRStatus.SubmittedToMonitoringOfficer,
        PCRStatus.QueriedByMonitoringOfficer,
        PCRStatus.SubmittedToInnovateUK,
      ]
    ]
  ]);

  private monitoringOfficerCanEdit = this.original && !!this.monitoringOfficerPermittedStatus.get(this.original.status);

  private maxCommentsLength = 1000;

  private validateComments(): Result {
    const isPM = !!(this.role & ProjectRole.ProjectManager);
    const isMO = !!(this.role & ProjectRole.MonitoringOfficer);
    if ((isPM && this.projectManagerCanEdit) || (isMO && this.monitoringOfficerCanEdit)) {
      const statusRequiringComments = isMO && this.monitoringOfficerCanEdit ? [PCRStatus.SubmittedToInnovateUK, PCRStatus.QueriedByMonitoringOfficer] : [];
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
        return new PCRTimeExtensionItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForTimeExtensionDto);
      case PCRItemType.ScopeChange:
        return new PCRScopeChangeItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForScopeChangeDto);
      case PCRItemType.ProjectSuspension:
        return new PCRProjectSuspensionItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForProjectSuspensionDto);
      case PCRItemType.ProjectTermination:
        return new PCRProjectTerminationItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForProjectTerminationDto);
      case PCRItemType.AccountNameChange:
        return new PCRAccountNameChangeItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, this.partners, originalItem as PCRItemForAccountNameChangeDto);
      case PCRItemType.PartnerWithdrawal:
        return new PCRPartnerWithdrawalItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, this.project, this.partners, originalItem as PCRItemForPartnerWithdrawalDto);
      case PCRItemType.PartnerAddition: {
        if (this.featureFlags.addPartnerWorkflow) {
          return new PCRPartnerAdditionItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForPartnerAdditionDto);
        }
         // TODO remove once feature flag is removed
        return new PCROldPartnerAdditionItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForPartnerAdditionDto);
      }
      case PCRItemType.MultiplePartnerFinancialVirement:
        return new MultiplePartnerFinancialVirementDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForMultiplePartnerFinancialVirementDto);
      case PCRItemType.PeriodLengthChange:
        return new PCRPeriodLengthChangeItemDtoValidator(item, canEdit, this.role, this.model.status, this.recordTypes, this.showValidationErrors, originalItem as PCRItemForPeriodLengthChangeDto);
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

  protected requiredIfComplete(value: any, message?: string) {
    if (this.model.status !== PCRItemStatus.Complete) {
      return Validation.valid(this);
    }
    return Validation.required(this, value, message);
  }

  protected hasPermissionToEdit(value: any, originalValue: any, message?: string) {
    if (this.canEdit) {
      return Validation.valid(this);
    }
    return Validation.isUnchanged(this, value, originalValue, message);
  }
}

export class PCRStandardItemDtoValidator extends PCRBaseItemDtoValidator<PCRStandardItemDto> {

}

export class MultiplePartnerFinancialVirementDtoValidator extends PCRBaseItemDtoValidator<PCRItemForMultiplePartnerFinancialVirementDto> {
  private validateGrantMovingOverFinancialYear() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.grantMovingOverFinancialYear, this.original && this.original.grantMovingOverFinancialYear, "The value of a grant moving over financial year cannot be changed.");
    }

    const hasValue = this.model.grantMovingOverFinancialYear || this.model.grantMovingOverFinancialYear === 0;

    return Validation.all(this,
      () => this.model.status === PCRItemStatus.Complete ? Validation.required(this, this.model.grantMovingOverFinancialYear, "Grant moving over financial year is required"): Validation.valid(this),
      () => Validation.number(this, this.model.grantMovingOverFinancialYear, "The value of a grant moving over financial year must be numerical."),
      () => hasValue ? Validation.isTrue(this, this.model.grantMovingOverFinancialYear! >= 0, "The value can not be lower than 0.") : Validation.valid(this)
    );
  }

  grantMovingOverFinancialYear = this.validateGrantMovingOverFinancialYear();
}

export class PCRTimeExtensionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForTimeExtensionDto> {
  private validateAdditionalMonths() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.additionalMonths, this.original && this.original.additionalMonths, "Project duration cannot be changed.");
    }

    const isComplete = this.model.status === PCRItemStatus.Complete;
    const hasValue = this.model.additionalMonths || this.model.additionalMonths === 0;

    return Validation.all(this,
      () => isComplete ? Validation.required(this, this.model.additionalMonths, "Please enter the number of months you want to extend your project by") : Validation.valid(this),
      () => Validation.number(this, this.model.additionalMonths, "Please enter a number of months you want to extend your project by"),
      () => hasValue ? Validation.isTrue(this, this.model.additionalMonths! > 0, "Please enter a number that increases the project duration") : Validation.valid(this),
      () => hasValue ? Validation.isTrue(this, Number.isInteger(this.model.additionalMonths!), "Please enter a whole number of months") : Validation.valid(this)
    );
  }

  additionalMonths = this.validateAdditionalMonths();
}

export class PCRProjectTerminationItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForProjectTerminationDto> {

}
export class PCRPeriodLengthChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPeriodLengthChangeDto> {

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
      () => this.model.suspensionEndDate ? Validation.isTrue(this, DateTime.fromJSDate(this.model.suspensionEndDate).plus({ days: 1 }).day === 1, "The date must be at the end of the month") : Validation.valid(this)
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

export class PCRPartnerAdditionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPartnerAdditionDto> {
  private validateProjectRoleRequired() {
    if (!this.model.isProjectRoleAndPartnerTypeRequired) {
      return this.requiredIfComplete(this.model.projectRole || null, "Select a project role");
    }
    return Validation.required(this, this.model.projectRole || null, "Select a project role");
  }
  private validatePartnerTypeRequired() {
    if (!this.model.isProjectRoleAndPartnerTypeRequired) {
      return this.requiredIfComplete(this.model.partnerType || null, "Select a partner type");
    }
    return Validation.required(this, this.model.partnerType || null, "Select a partner type");
  }
  private validateOrganisationNameRequired() {
    if (this.model.partnerType !== PCRPartnerType.Research) return Validation.valid(this);
    return this.requiredIfComplete(this.model.organisationName, "Enter an organisation name");
  }

  private validateProjectManagerDetailsRequired(value: any, message: string) {
    if (this.model.projectRole !== PCRProjectRole.ProjectLead) return Validation.valid(this);
    return this.requiredIfComplete(value, message);
  }

  private validateCompanyHouseDetailsRequired(value: any, message: string) {
    if (this.model.partnerType === PCRPartnerType.Research) return Validation.valid(this);
    return this.requiredIfComplete(value, message);
  }

  spendProfile = Validation.nested(this, this.model.spendProfile, x => new PCRSpendProfileDtoValidator(x, this.showValidationErrors), "Spend profile is not valid");

  projectRole = Validation.all(this,
    () => this.validateProjectRoleRequired(),
    () => !this.canEdit || this.original && this.original.projectRole ? Validation.isUnchanged(this, this.model.projectRole, this.original && this.original.projectRole, "Project role cannot be changed") : Validation.valid(this),
    );

  partnerType = Validation.all(this,
    () => this.validatePartnerTypeRequired(),
    () => !this.canEdit || this.original && this.original.partnerType ? Validation.isUnchanged(this, this.model.partnerType, this.original && this.original.partnerType, "Partner type cannot be changed") : Validation.valid(this),
  );

  organisationName = Validation.all(this,
    () => this.validateOrganisationNameRequired(),
    () => this.hasPermissionToEdit(this.model.organisationName, this.original && this.original.organisationName, "Organisation name cannot be changed"),
  );

  companyHouseOrganisationName = Validation.all(this,
    () => this.validateCompanyHouseDetailsRequired(this.model.organisationName, "Enter an organisation name"),
    () => this.hasPermissionToEdit(this.model.organisationName, this.original && this.original.organisationName, "Organisation name cannot be changed"),
  );

  registeredAddress = Validation.all(this,
    () => this.validateCompanyHouseDetailsRequired(this.model.registeredAddress, "Enter a registered address"),
    () => this.hasPermissionToEdit(this.model.registeredAddress, this.original && this.original.registeredAddress, "Registered address cannot be changed"),
  );

  registrationNumber = Validation.all(this,
    () => this.validateCompanyHouseDetailsRequired(this.model.registrationNumber, "Enter a registration number"),
    () => this.hasPermissionToEdit(this.model.registrationNumber, this.original && this.original.registrationNumber, "Registration number cannot be changed"),
  );

  financialYearEndDate = Validation.all(this,
    () => this.model.partnerType !== PCRPartnerType.Research ? this.requiredIfComplete(this.model.financialYearEndDate, "Enter a financial year end") : Validation.valid(this),
    () => Validation.isDate(this, this.model.financialYearEndDate, "Enter a real financial year end date"),
    () => this.hasPermissionToEdit(this.model.financialYearEndDate, this.original && this.original.financialYearEndDate, "Turnover year end cannot be changed"),
  );

  financialYearEndTurnover = Validation.all(this,
    () => this.model.partnerType !== PCRPartnerType.Research ? this.requiredIfComplete(this.model.financialYearEndTurnover, "Enter a financial year end turnover") : Validation.valid(this),
    () => Validation.isPositiveCurrency(this, this.model.financialYearEndTurnover, "Enter a financial year end turnover amount equal to or greater than 0"),
    () => this.hasPermissionToEdit(this.model.financialYearEndTurnover, this.original && this.original.financialYearEndTurnover, "Turnover cannot be changed"),
  );

  contact1ProjectRole = Validation.all(this,
    () => this.requiredIfComplete(this.model.contact1ProjectRole, "Select a finance contact project role"),
    () => this.hasPermissionToEdit(this.model.contact1ProjectRole, this.original && this.original.contact1ProjectRole, `Role cannot be changed`),
  );

  contact1Forename = Validation.all(this,
    () => this.requiredIfComplete(this.model.contact1Forename, "Enter a finance contact name"),
    () => this.hasPermissionToEdit(this.model.contact1Forename, this.original && this.original.contact1Forename, `Name cannot be changed`),
  );

  contact1Surname = Validation.all(this,
    () => this.requiredIfComplete(this.model.contact1Surname, "Enter a finance contact surname"),
    () => this.hasPermissionToEdit(this.model.contact1Surname, this.original && this.original.contact1Surname, `Surname cannot be changed`),
  );

  contact1Phone = Validation.all(this,
    () => this.requiredIfComplete(this.model.contact1Phone, "Enter a finance contact phone number"),
    () => this.hasPermissionToEdit(this.model.contact1Phone, this.original && this.original.contact1Phone, `Phone number cannot be changed`),
  );

  contact1Email = Validation.all(this,
    () => this.requiredIfComplete(this.model.contact1Email, "Enter a finance contact email address"),
    () => this.hasPermissionToEdit(this.model.contact1Email, this.original && this.original.contact1Email, `Email address cannot be changed`),
  );

  contact2ProjectRole = Validation.all(this,
    () => this.validateProjectManagerDetailsRequired(this.model.contact2ProjectRole, "Select a project manager project role"),
    () => this.hasPermissionToEdit(this.model.contact2ProjectRole, this.original && this.original.contact2ProjectRole, `Role cannot be changed`),
  );

  contact2Forename = Validation.all(this,
    () => this.validateProjectManagerDetailsRequired(this.model.contact2Forename, "Enter a project manager name"),
    () => this.hasPermissionToEdit(this.model.contact2Forename, this.original && this.original.contact2Forename, `Name cannot be changed`),
  );

  contact2Surname = Validation.all(this,
    () => this.validateProjectManagerDetailsRequired(this.model.contact2Surname, "Enter a project manager surname"),
    () => this.hasPermissionToEdit(this.model.contact2Surname, this.original && this.original.contact2Surname, `Surname cannot be changed`),
  );

  contact2Phone = Validation.all(this,
    () => this.validateProjectManagerDetailsRequired(this.model.contact2Phone, "Enter a project manager phone number"),
    () => this.hasPermissionToEdit(this.model.contact2Phone, this.original && this.original.contact2Phone, `Phone number cannot be changed`),
  );

  contact2Email = Validation.all(this,
    () => this.validateProjectManagerDetailsRequired(this.model.contact2Email, "Enter a project manager email address"),
    () => this.hasPermissionToEdit(this.model.contact2Email, this.original && this.original.contact2Email, `Email address cannot be changed`),
  );

  projectLocation = Validation.all(this,
    () => this.requiredIfComplete(this.model.projectLocation || null, "Select a project location"),
    () => this.hasPermissionToEdit(this.model.projectLocation, this.original && this.original.projectLocation, "Project location cannot be changed"),
  );

  projectCity = Validation.all(this,
    () => this.requiredIfComplete(this.model.projectCity, "Enter a project city"),
    () => this.hasPermissionToEdit(this.model.projectCity, this.original && this.original.projectCity, "Project city cannot be changed"),
  );

  projectPostcode = this.hasPermissionToEdit(this.model.projectPostcode, this.original && this.original.projectPostcode, "Project postcode cannot be changed");

  participantSize = Validation.all(this,
    () => this.requiredIfComplete(this.model.participantSize || null, "Select a participant size"),
    () => this.hasPermissionToEdit(this.model.participantSize, this.original && this.original.participantSize, "Participant size cannot be changed"),
  );

  numberOfEmployees = Validation.all(this,
    () => this.model.partnerType !== PCRPartnerType.Research ? this.requiredIfComplete(this.model.numberOfEmployees, "Enter the number of employees") : Validation.valid(this),
    () => Validation.isPositiveInteger(this, this.model.numberOfEmployees, "Please enter a valid number of employees"),
    () => this.hasPermissionToEdit(this.model.numberOfEmployees, this.original && this.original.numberOfEmployees, "Number of employees cannot be changed"),
  );
}

export class PCROldPartnerAdditionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPartnerAdditionDto> {
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
      () => this.partners && this.model.partnerId ? Validation.permitedValues(this, this.model.partnerId, this.partners.filter(x => !x.isWithdrawn).map(x => x.id), "Invalid partner for project") : Validation.valid(this)
    );
  }

  accountName = this.validateAccountName();
  partnerId = this.validatePartnerId();
}

export class PCRPartnerWithdrawalItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPartnerWithdrawalDto> {
  constructor(
    model: PCRItemForPartnerWithdrawalDto,
    protected readonly canEdit: boolean,
    protected readonly role: ProjectRole,
    protected readonly pcrStatus: PCRStatus,
    protected readonly recordTypes: PCRItemTypeDto[],
    showValidationErrors: boolean,
    protected readonly project: ProjectDto,
    protected readonly partners?: PartnerDto[],
    protected readonly original?: PCRItemForPartnerWithdrawalDto
  ) {
    super(model, canEdit, role, pcrStatus, recordTypes, showValidationErrors, original);
  }

  private validateWithdrawalDate() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.withdrawalDate, this.original && this.original.withdrawalDate, "Withdrawal date cannot be changed.");
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    const removalPeriod = periodInProject(this.model.withdrawalDate, this.project);
    return Validation.all(this,
      () => isComplete ? Validation.required(this, this.model.withdrawalDate, "Enter a removal date") : Validation.valid(this),
      () => Validation.isDate(this, this.model.withdrawalDate, "Enter a real removal date"),
      () => Validation.isBeforeOrSameDay(this, this.model.withdrawalDate, this.project.endDate, `Withdrawal date must be before project is due to finish.`),
      () => isNumber(removalPeriod) ? Validation.isTrue(this, removalPeriod > 0, "Withdrawal date must be after the project started") : Validation.valid(this)
    );
  }

  // tslint:disable-next-line:no-identical-functions
  private validatePartnerId() {
    if (!this.canEdit) {
      return Validation.isUnchanged(this, this.model.partnerId, this.original && this.original.partnerId, "Partner cannot be changed.");
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(this,
      () => isComplete ? Validation.required(this, this.model.partnerId, "Select a partner to remove from the project") : Validation.valid(this),
      () => this.partners && this.model.partnerId ? Validation.permitedValues(this, this.model.partnerId, this.partners.filter(x => !x.isWithdrawn).map(x => x.id), "Invalid partner for project") : Validation.valid(this)
    );
  }

  withdrawalDate = this.validateWithdrawalDate();
  partnerId = this.validatePartnerId();
}
