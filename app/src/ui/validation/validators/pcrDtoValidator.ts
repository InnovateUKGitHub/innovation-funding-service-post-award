import {
  PCRStepId,
  PCRStatus,
  PCRItemStatus,
  PCRItemType,
  pcrUnduplicatableMatrix,
  getUnavailablePcrItemsMatrix,
  PCROrganisationType,
  PCRProjectRole,
} from "@framework/constants/pcrConstants";
import { ProjectRole, ProjectMonitoringLevel } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import {
  PCRItemTypeDto,
  PCRDto,
  PCRSummaryDto,
  PCRItemDto,
  PCRItemForTimeExtensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForPeriodLengthChangeDto,
  PCRItemForLoanDrawdownChangeDto,
  PCRItemForLoanDrawdownExtensionDto,
} from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import isNull from "@ui/helpers/is-null";
import { NestedResult } from "@ui/validation/nestedResult";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import { PCRSpendProfileDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { DateTime } from "luxon";
import * as Validation from "./common";

interface PCRBaseDtoValidationProps<T> {
  model: T;
  original?: T;
  role?: ProjectRole;
  recordTypes?: PCRItemTypeDto[];
  showValidationErrors?: boolean;
  project?: ProjectDto;
  partners?: PartnerDto[];
  pcrStepId?: PCRStepId;
}

interface PCRBaseDtoHeaderValidatorProps extends PCRBaseDtoValidationProps<PCRDto> {
  projectPcrs?: PCRSummaryDto[];
}

interface PCRBaseItemDtoValidatorProps<T extends PCRItemDto> extends PCRBaseDtoValidationProps<T> {
  canEdit: boolean;
  pcrStatus: PCRStatus;
}

export class PCRDtoValidator extends Results<PCRDto> {
  private readonly role: ProjectRole = ProjectRole.Unknown;
  private readonly recordTypes: PCRItemTypeDto[] = [];
  private readonly project?: ProjectDto;
  private readonly original?: PCRDto;
  private readonly partners?: PartnerDto[];
  private readonly projectPcrs?: PCRSummaryDto[];
  private readonly pcrStepId: PCRStepId;

  private readonly projectManagerCanEdit: boolean;
  private readonly monitoringOfficerCanEdit: boolean;

  public comments: Result;
  public status: Result;
  public reasoningComments: Result;
  public reasoningStatus: Result;
  public items: NestedResult<
    | PCRTimeExtensionItemDtoValidator
    | PCRScopeChangeItemDtoValidator
    | PCRProjectSuspensionItemDtoValidator
    | PCRProjectTerminationItemDtoValidator
    | PCRAccountNameChangeItemDtoValidator
    | PCRPartnerWithdrawalItemDtoValidator
    | PCRPartnerAdditionItemDtoValidator
    | MultiplePartnerFinancialVirementDtoValidator
    | PCRPeriodLengthChangeItemDtoValidator
    | PCRLoanDrawdownChangeItemDtoValidator
    | PCRLoanExtensionItemDtoValidator
  >;

  constructor({
    model,
    role = ProjectRole.Unknown,
    recordTypes = [],
    showValidationErrors = false,
    project,
    original,
    partners,
    projectPcrs,
    pcrStepId = PCRStepId.none,
  }: PCRBaseDtoHeaderValidatorProps) {
    super({ model, showValidationErrors });
    this.role = role;
    this.recordTypes = recordTypes;
    this.project = project;
    this.original = original;
    this.partners = partners;
    this.projectPcrs = projectPcrs;
    this.pcrStepId = pcrStepId;

    this.projectManagerCanEdit = !this.original || !!this.projectManagerPermittedStatus.get(this.original.status);
    this.monitoringOfficerCanEdit =
      (this.original && !!this.monitoringOfficerPermittedStatus.get(this.original.status)) ?? false;

    // Validating these fields requires above values to be computed
    this.comments = this.validateComments();
    this.reasoningComments = this.validateReasoningComments();
    this.reasoningStatus = this.validateReasonStatus();
    this.items = this.validateItems();
    this.status = this.validateStatus();
  }

  private readonly projectManagerPermittedStatus = new Map<
    PCRStatus,
    { standardMonitoring: PCRStatus[]; internalAssurance: PCRStatus[] }
  >([
    [
      PCRStatus.Draft,
      {
        standardMonitoring: [PCRStatus.Draft, PCRStatus.SubmittedToMonitoringOfficer],
        internalAssurance: [PCRStatus.Draft, PCRStatus.SubmittedToInnovateUK],
      },
    ],
    [
      PCRStatus.QueriedByMonitoringOfficer,
      {
        standardMonitoring: [PCRStatus.QueriedByMonitoringOfficer, PCRStatus.SubmittedToMonitoringOfficer],
        internalAssurance: [PCRStatus.QueriedByMonitoringOfficer, PCRStatus.SubmittedToInnovateUK],
      },
    ],
    [
      PCRStatus.QueriedByInnovateUK,
      {
        standardMonitoring: [PCRStatus.QueriedByInnovateUK, PCRStatus.SubmittedToInnovateUK],
        internalAssurance: [PCRStatus.QueriedByInnovateUK, PCRStatus.SubmittedToInnovateUK],
      },
    ],
  ]);

  private readonly monitoringOfficerPermittedStatus = new Map<
    PCRStatus,
    { standardMonitoring: PCRStatus[]; internalAssurance: PCRStatus[] }
  >([
    [
      PCRStatus.SubmittedToMonitoringOfficer,
      {
        standardMonitoring: [
          PCRStatus.SubmittedToMonitoringOfficer,
          PCRStatus.QueriedByMonitoringOfficer,
          PCRStatus.SubmittedToInnovateUK,
        ],
        internalAssurance: [],
      },
    ],
  ]);

  static readonly maxCommentsLength = 1000;
  static readonly maxSalesforceFieldLength = 32000;

  private validateComments(): Result {
    const { isPm, isMo } = getAuthRoles(this.role);

    const canPmEdit = isPm && this.projectManagerCanEdit;
    const canMoEdit = isMo && this.monitoringOfficerCanEdit;

    if (canPmEdit || canMoEdit) {
      const statusRequiringComments = canMoEdit
        ? [PCRStatus.SubmittedToInnovateUK, PCRStatus.QueriedByMonitoringOfficer]
        : [];

      return Validation.all(
        this,
        () =>
          statusRequiringComments.includes(this.model.status)
            ? Validation.required(
                this,
                this.model.comments,
                this.getContent(x => x.validation.pcrDtoValidator.commentRequired),
              )
            : Validation.valid(this),
        () =>
          Validation.maxLength(
            this,
            this.model.comments,
            PCRDtoValidator.maxCommentsLength,
            this.getContent(x =>
              x.validation.pcrDtoValidator.commentLengthTooLarge({ count: PCRDtoValidator.maxCommentsLength }),
            ),
          ),
      );
    }

    if (!this.original) {
      return Validation.isTrue(
        this,
        !this.model.comments,
        this.getContent(x => x.validation.pcrDtoValidator.commentReadOnly),
      );
    }

    return Validation.isTrue(
      this,
      this.model.comments === this.original.comments,
      this.getContent(x => x.validation.pcrDtoValidator.commentReadOnly),
    );
  }

  private validateReasoningComments() {
    const { isPm } = getAuthRoles(this.role);

    if (isPm && this.projectManagerCanEdit) {
      return Validation.all(
        this,
        () =>
          this.model.reasoningStatus === PCRItemStatus.Complete
            ? Validation.required(
                this,
                this.model.reasoningComments,
                this.getContent(x => x.validation.pcrDtoValidator.reasoningRequired),
              )
            : Validation.valid(this),
        () =>
          Validation.maxLength(
            this,
            this.model.reasoningComments,
            PCRDtoValidator.maxCommentsLength,
            this.getContent(x =>
              x.validation.pcrDtoValidator.reasoningLengthTooLarge({ count: PCRDtoValidator.maxCommentsLength }),
            ),
          ),
      );
    }

    if (!this.original) {
      return Validation.isTrue(
        this,
        !this.model.reasoningComments,
        this.getContent(x => x.validation.pcrDtoValidator.reasoningReadOnly),
      );
    }

    return Validation.isTrue(
      this,
      this.model.reasoningComments === this.original.reasoningComments,
      this.getContent(x => x.validation.pcrDtoValidator.reasoningReadOnly),
    );
  }

  private validateStatus() {
    const permittedStatus: PCRStatus[] = [];
    const { isPm, isMo } = getAuthRoles(this.role);

    if (isPm) {
      if (!this.original) {
        permittedStatus.push(PCRStatus.Draft);
      } else {
        permittedStatus.push(
          ...(this.projectManagerPermittedStatus.get(this.original.status)?.[
            this.project?.monitoringLevel === ProjectMonitoringLevel.InternalAssurance
              ? "internalAssurance"
              : "standardMonitoring"
          ] ?? []),
        );
      }
    }

    if (isMo && this.original) {
      permittedStatus.push(
        ...(this.monitoringOfficerPermittedStatus.get(this.original.status)?.[
          this.project?.monitoringLevel === ProjectMonitoringLevel.InternalAssurance
            ? "internalAssurance"
            : "standardMonitoring"
        ] ?? []),
      );
    }

    return Validation.all(this, () =>
      Validation.permittedValues(
        this,
        this.model.status,
        permittedStatus,
        this.getContent(x => x.validation.pcrDtoValidator.statusInvalid),
      ),
    );
  }

  private validateReasonStatus() {
    const permittedStatus = [PCRItemStatus.ToDo, PCRItemStatus.Incomplete, PCRItemStatus.Complete];

    const preparePcrStatus = [PCRStatus.Draft, PCRStatus.QueriedByMonitoringOfficer, PCRStatus.QueriedByInnovateUK];
    return Validation.all(
      this,
      () =>
        Validation.permittedValues(
          this,
          this.model.reasoningStatus,
          permittedStatus,
          this.getContent(x => x.validation.pcrDtoValidator.reasoningStatusRequired),
        ),
      () =>
        Validation.isTrue(
          this,
          this.model.reasoningStatus === PCRItemStatus.Complete || preparePcrStatus.indexOf(this.model.status) >= 0,
          this.getContent(x => x.validation.pcrDtoValidator.reasonsIncomplete),
        ),
    );
  }

  private getItemValidator(item: PCRItemDto) {
    const { isPm } = getAuthRoles(this.role);
    const canEdit = isPm ? this.projectManagerCanEdit : false;
    const originalItem = this.original && this.original.items.find(x => x.id === item.id);

    const params: PCRBaseItemDtoValidatorProps<typeof item> = {
      model: item,
      canEdit,
      role: this.role,
      pcrStatus: this.model.status,
      recordTypes: this.recordTypes,
      showValidationErrors: this.showValidationErrors,
      original: originalItem,
      partners: this.partners,
      project: this.project,
      pcrStepId: this.pcrStepId,
    };

    switch (item.type) {
      case PCRItemType.TimeExtension:
        return new PCRTimeExtensionItemDtoValidator(params as PCRBaseItemDtoValidatorProps<PCRItemForTimeExtensionDto>);
      case PCRItemType.ScopeChange:
        return new PCRScopeChangeItemDtoValidator(params as PCRBaseItemDtoValidatorProps<PCRItemForScopeChangeDto>);
      case PCRItemType.ProjectSuspension:
        return new PCRProjectSuspensionItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForProjectSuspensionDto>,
        );
      case PCRItemType.ProjectTermination:
        return new PCRProjectTerminationItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForProjectTerminationDto>,
        );
      case PCRItemType.AccountNameChange:
        return new PCRAccountNameChangeItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForAccountNameChangeDto>,
        );
      case PCRItemType.PartnerWithdrawal:
        return new PCRPartnerWithdrawalItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForPartnerWithdrawalDto>,
        );
      case PCRItemType.PartnerAddition: {
        return new PCRPartnerAdditionItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForPartnerAdditionDto>,
        );
      }
      case PCRItemType.MultiplePartnerFinancialVirement:
        return new MultiplePartnerFinancialVirementDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForMultiplePartnerFinancialVirementDto>,
        );
      case PCRItemType.PeriodLengthChange:
        return new PCRPeriodLengthChangeItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForPeriodLengthChangeDto>,
        );
      case PCRItemType.LoanDrawdownChange:
        return new PCRLoanDrawdownChangeItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForLoanDrawdownChangeDto>,
        );
      case PCRItemType.LoanDrawdownExtension:
        return new PCRLoanExtensionItemDtoValidator(
          params as PCRBaseItemDtoValidatorProps<PCRItemForLoanDrawdownExtensionDto>,
        );
      default:
        throw new Error("PCR Type not implemented");
    }
  }

  private getExistingPcrItemError(invalidTypes: PCRItemType[]): string {
    // Note: Extract invalid displayNames from inbound payload
    const errorTypes = this.recordTypes.reduce<string[]>((acc, x) => {
      if (!invalidTypes.includes(x.type)) return acc;

      return acc.concat(x.displayName);
    }, []);

    return this.getContent(x => x.validation.pcrDtoValidator.typeOverpopulated({ types: errorTypes }));
  }

  private validateItems() {
    const statusWhenNotRequiredToBeComplete = [
      PCRStatus.Draft,
      PCRStatus.QueriedByInnovateUK,
      PCRStatus.QueriedByMonitoringOfficer,
      PCRStatus.QueriedByInnovationLead,
    ];

    return Validation.child(
      this,
      this.model.items,
      item => this.getItemValidator(item),
      children =>
        children.all(
          () => children.required(this.getContent(x => x.validation.pcrDtoValidator.typeRequired)),
          // TODO: add some validation to secure against deprecated PCR item
          // () =>
          //   children.isTrue(
          //     items => items.some(x => ![PCRItemType.ProjectTermination].includes(x.type)),
          //     "The item type you have requested is not available",
          //   ),
          () => {
            return children.isTrue(
              items => {
                const seenProjectPcrs = new Set<PCRItemType>();

                for (const projectPcr of items) {
                  // If a PCR type is non-duplicatable, check if it has not already been added to the PCR.
                  if (pcrUnduplicatableMatrix[projectPcr.type] && seenProjectPcrs.has(projectPcr.type)) {
                    return false;
                  }

                  seenProjectPcrs.add(projectPcr.type);
                }
                return true;
              },
              this.getContent(x => x.validation.pcrDtoValidator.duplicateNotAllowed),
            );
          },
          () =>
            children.isTrue(
              items => {
                // If we are in a draft, allow the same partner to be selected more than once.
                if (statusWhenNotRequiredToBeComplete.includes(this.model.status)) return true;

                const seenPartnerIds = new Set<string>();

                for (const projectPcr of items) {
                  // Ensure "Remove a partner" request doesn't have the same partner twice (or more!)
                  if (projectPcr.type === PCRItemType.PartnerWithdrawal && projectPcr.partnerId) {
                    if (seenPartnerIds.has(projectPcr.partnerId)) {
                      return false;
                    } else {
                      seenPartnerIds.add(projectPcr.partnerId);
                    }
                  }
                }
                return true;
              },
              this.getContent(x => x.validation.pcrDtoValidator.samePartnerRemovedTwice),
            ),
          () =>
            children.isTrue(
              items => {
                // If we are in a draft, allow the same partner to be selected more than once.
                if (statusWhenNotRequiredToBeComplete.includes(this.model.status)) return true;

                const seenPartnerIds = new Set<string>();

                for (const projectPcr of items) {
                  // Ensure "Rename a partner" request doesn't have the same partner twice (or more!)
                  if (projectPcr.type === PCRItemType.AccountNameChange && projectPcr.partnerId) {
                    if (seenPartnerIds.has(projectPcr.partnerId)) {
                      return false;
                    } else {
                      seenPartnerIds.add(projectPcr.partnerId);
                    }
                  }
                }
                return true;
              },
              this.getContent(x => x.validation.pcrDtoValidator.samePartnerRenamedTwice),
            ),
          () =>
            children.isTrue(
              items =>
                this.partners?.length
                  ? items.filter(x => x.type === PCRItemType.AccountNameChange).length <= this.partners.length
                  : true,
              this.getContent(x => x.validation.pcrDtoValidator.notEnoughPartnersToRename),
            ),
          () =>
            children.isTrue(
              items => {
                if (!this.partners?.length) return true;

                const hasAnyAdditions = items.some(x => x.type === PCRItemType.PartnerAddition);

                // Maximum number of deletes allowed.
                // `n`   You can delete all partners if we have any additions
                // `n-1` You cannot delete all partners if there are no additions
                const maxDeletes = hasAnyAdditions ? this.partners.length : this.partners.length - 1;

                // Accept validation if we have any "add partner"
                // Otherwise, fail validation if we have too many partners
                return items.filter(x => x.type === PCRItemType.PartnerWithdrawal).length <= maxDeletes;
              },
              this.getContent(x => x.validation.pcrDtoValidator.notEnoughPartnersToRemove),
            ),
          () => {
            if (!this.projectPcrs?.length) return children.valid();

            const allPcrsExceptDto = this.projectPcrs.filter(x => x.id !== this.model.id);
            const unavailablePcrItems = getUnavailablePcrItemsMatrix(allPcrsExceptDto);

            return children.hasMatchingValue(
              unavailablePcrItems,
              x => x.type,
              rejectedItemTypes => this.getExistingPcrItemError(rejectedItemTypes),
            );
          },
        ),
    );
  }
}

export class PCRBaseItemDtoValidator<T extends PCRItemDto> extends Results<T> {
  protected readonly canEdit: boolean;
  protected readonly role: ProjectRole = ProjectRole.Unknown;
  protected readonly pcrStatus: PCRStatus;
  protected readonly recordTypes: PCRItemTypeDto[] = [];
  protected readonly original?: T;
  protected readonly project?: ProjectDto;
  protected readonly partners?: PartnerDto[];
  protected readonly pcrStepId?: PCRStepId;
  public status: Result;
  public type: Result;

  constructor({
    model,
    canEdit,
    role = ProjectRole.Unknown,
    pcrStatus,
    recordTypes = [],
    original,
    showValidationErrors = false,
    project,
    partners,
    pcrStepId,
  }: PCRBaseItemDtoValidatorProps<T>) {
    super({ model, showValidationErrors });

    // Assign data to the Validator
    this.canEdit = canEdit;
    this.role = role;
    this.pcrStatus = pcrStatus;
    this.recordTypes = recordTypes;
    this.original = original;
    this.project = project;
    this.partners = partners;
    this.pcrStepId = pcrStepId;

    // Use above assigned data to validate dto
    // Do not place outside of constructor like `public status = this.validateStatus();`,
    // as the above data will not have yet been assigned yet.
    this.status = this.validateStatus();
    this.type = this.validateTypes();
  }

  private validateTypes() {
    const { isPm } = getAuthRoles(this.role);
    return Validation.all(
      this,
      () =>
        Validation.isTrue(
          this,
          this.recordTypes.map(x => x.type).indexOf(this.model.type) >= 0,
          this.getContent(x => x.validation.pcrBaseItemDtoValidator.itemInvalid),
        ),
      () =>
        Validation.isTrue(
          this,
          !!this.original || (this.recordTypes.find(x => x.type === this.model.type)?.enabled ?? null),
          this.getContent(x => x.validation.pcrBaseItemDtoValidator.itemInvalid),
        ),
      () => {
        const inValidRecordIndex = this.recordTypes.findIndex(x => x.recordTypeId === "Unknown");

        if (inValidRecordIndex === -1) return Validation.valid(this);

        // Note: At this point it is likely that SF does not have the recordType to match up against our local item options.
        return Validation.inValid(
          this,
          this.getContent(x =>
            x.validation.pcrBaseItemDtoValidator.itemUnavailable({
              name: this.recordTypes[inValidRecordIndex]?.displayName,
            }),
          ),
        );
      },
      // If role is not Project Manager then can not add new type
      () =>
        Validation.isTrue(
          this,
          isPm || !!this.original,
          this.getContent(x => x.validation.pcrBaseItemDtoValidator.cannotAddType),
        ),
    );
  }

  private validateStatus() {
    const { isPm } = getAuthRoles(this.role);

    const permittedStatus = [PCRItemStatus.ToDo, PCRItemStatus.Incomplete, PCRItemStatus.Complete];

    const statusWhenNotRequiredToBeComplete = [
      PCRStatus.Draft,
      PCRStatus.QueriedByInnovateUK,
      PCRStatus.QueriedByMonitoringOfficer,
    ];

    return Validation.all(
      this,
      () =>
        Validation.permittedValues(
          this,
          this.model.status,
          permittedStatus,
          this.getContent(x => x.validation.pcrBaseItemDtoValidator.statusInvalid),
        ),
      () =>
        isPm
          ? Validation.isTrue(
              this,
              this.model.status === PCRItemStatus.Complete ||
                statusWhenNotRequiredToBeComplete.indexOf(this.pcrStatus) >= 0,
              this.getContent(x => x.validation.pcrBaseItemDtoValidator.itemIncomplete({ name: this.model.typeName })),
            )
          : Validation.isTrue(
              this,
              !this.original || this.model.status === this.original.status,
              this.getContent(x => x.validation.pcrBaseItemDtoValidator.cannotUpdateItemStatus),
            ),
    );
  }

  protected requiredIfStep(state: PCRStepId, value: Validation.ValidatableValue, message?: string) {
    if (this.pcrStepId !== state) {
      return Validation.valid(this);
    }
    return Validation.required(this, value, message);
  }

  protected requiredIfComplete(value: Validation.ValidatableValue, message?: string) {
    if (this.model.status !== PCRItemStatus.Complete) {
      return Validation.valid(this);
    }
    return Validation.required(this, value, message);
  }

  protected hasPermissionToEdit(
    value: Validation.ValidatableValue,
    originalValue: Validation.ValidatableValue,
    message?: string,
  ) {
    if (this.canEdit) {
      return Validation.valid(this);
    }
    return Validation.isUnchanged(this, value, originalValue, message);
  }
}

export class MultiplePartnerFinancialVirementDtoValidator extends PCRBaseItemDtoValidator<PCRItemForMultiplePartnerFinancialVirementDto> {
  private validateGrantMovingOverFinancialYear() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.grantMovingOverFinancialYear,
        this.original && this.original.grantMovingOverFinancialYear,
        this.getContent(x => x.validation.multiplePartnerFinancialVirementDtoValidator.grantValueReadOnly),
      );
    }

    const hasValue = this.model.grantMovingOverFinancialYear || this.model.grantMovingOverFinancialYear === 0;

    return Validation.all(
      this,
      () =>
        this.model.status === PCRItemStatus.Complete
          ? Validation.required(
              this,
              this.model.grantMovingOverFinancialYear,
              this.getContent(
                x => x.validation.multiplePartnerFinancialVirementDtoValidator.grantMovingOverFinancialYearRequired,
              ),
            )
          : Validation.valid(this),
      () =>
        Validation.number(
          this,
          this.model.grantMovingOverFinancialYear,
          this.getContent(
            x => x.validation.multiplePartnerFinancialVirementDtoValidator.grantMovingOverFinancialYearNotNumber,
          ),
        ),
      () =>
        hasValue
          ? Validation.isTrue(
              this,
              (this.model.grantMovingOverFinancialYear ?? 0) >= 0,
              this.getContent(
                x => x.validation.multiplePartnerFinancialVirementDtoValidator.grantMovingOverFinancialYearTooSmall,
              ),
            )
          : Validation.valid(this),
    );
  }

  grantMovingOverFinancialYear = this.validateGrantMovingOverFinancialYear();
}

export class PCRTimeExtensionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForTimeExtensionDto> {
  private validateOffsetMonths(): Result {
    const { offsetMonths } = this.model;

    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        offsetMonths,
        this.original?.offsetMonths,
        this.getContent(x => x.validation.pcrTimeExtensionItemDtoValidator.projectDurationReadOnly),
      );
    }

    const isComplete = this.model.status === PCRItemStatus.Complete;

    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.all(
              this,
              () =>
                Validation.required(
                  this,
                  offsetMonths,
                  this.getContent(x => x.validation.pcrTimeExtensionItemDtoValidator.offsetMonthsMissing),
                ),
              () =>
                Validation.isTrue(
                  this,
                  offsetMonths !== 0,
                  this.getContent(x => x.validation.pcrTimeExtensionItemDtoValidator.offsetMonthsTooSmall),
                ),
            )
          : Validation.valid(this),
      () =>
        offsetMonths
          ? Validation.integer(
              this,
              offsetMonths,
              this.getContent(x =>
                x.validation.pcrTimeExtensionItemDtoValidator.offsetMonthsNotInteger({ count: offsetMonths }),
              ),
            )
          : Validation.valid(this),
    );
  }

  offsetMonthsResult = this.validateOffsetMonths();
}

export class PCRLoanExtensionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForLoanDrawdownExtensionDto> {
  public allPeriods: Result;
  public availabilityPeriodChange: Result;
  public extensionPeriodChange: Result;
  public repaymentPeriodChange: Result;

  constructor(data: PCRBaseItemDtoValidatorProps<PCRItemForLoanDrawdownExtensionDto>) {
    super(data);
    this.allPeriods = this.validateAllPeriods();
    this.availabilityPeriodChange = this.validateAvailabilityPeriod();
    this.extensionPeriodChange = this.validateExtensionPeriod();
    this.repaymentPeriodChange = this.validateRepaymentPeriod();
  }

  private isComplete = this.model.status === PCRItemStatus.Complete;
  private validationTolerance = 3;

  public checkInEditable(date: Date): boolean {
    const dateToCheck = DateTime.fromJSDate(date);
    const latestEditableDate = dateToCheck.plus({ month: this.validationTolerance, day: 1 });
    const dateWithTolerance = latestEditableDate.diffNow(["months"]);

    // Note: Negative numbers are over the tolerance
    return dateWithTolerance.months < 0;
  }

  public calculateOffsetDate(offset: number): Date {
    const startingDate = this.model.projectStartDate;
    if (startingDate === null) {
      throw new Error("Cannot calculate offset date of null");
    }

    if (offset === 0) return startingDate;

    const internalDate = DateTime.fromJSDate(startingDate).setZone("Europe/London");
    const offsetDate = internalDate.plus({ months: offset });

    return offsetDate.toJSDate();
  }

  private validateAllPeriods(): Result {
    if (!this.isComplete) return Validation.valid(this);

    const isAvailabilityInValid = this.model.availabilityPeriod === this.model.availabilityPeriodChange;
    const isExtensionInValid = this.model.extensionPeriod === this.model.extensionPeriodChange;
    const isRepaymentInValid = this.model.repaymentPeriod === this.model.repaymentPeriodChange;

    const isInvalid = isAvailabilityInValid && isExtensionInValid && isRepaymentInValid;

    return Validation.isFalse(
      this,
      isInvalid,
      this.getContent(x => x.validation.pcrLoanExtensionItemDtoValidator.phaseChangeRequired),
    );
  }

  private validateAvailabilityPeriod(): Result {
    const { availabilityPeriod, availabilityPeriodChange, id } = this.model;
    if (!id) return Validation.valid(this); // missing id shows pcr not created yet
    if (isNull(availabilityPeriod)) {
      throw Error("validateAvailabilityPeriod() is missing model data to validate.");
    }

    const availabilityPeriodDate = this.calculateOffsetDate(availabilityPeriod);

    return this.validateWholeMonths(
      "Availability period",
      availabilityPeriodDate,
      availabilityPeriod,
      availabilityPeriodChange,
    );
  }

  private validateExtensionPeriod(): Result {
    const { availabilityPeriod, extensionPeriod, extensionPeriodChange, id } = this.model;
    if (!id) return Validation.valid(this); // missing id shows pcr not created yet

    if (isNull(availabilityPeriod) || isNull(extensionPeriod)) {
      throw Error("validateExtensionPeriod() is missing model data to validate.");
    }

    const totalPeriods = availabilityPeriod + extensionPeriod;
    const extensionPeriodPeriodDate = this.calculateOffsetDate(totalPeriods);

    return this.validateWholeMonths(
      "Extension period",
      extensionPeriodPeriodDate,
      extensionPeriod,
      extensionPeriodChange,
    );
  }

  private validateRepaymentPeriod(): Result {
    const { availabilityPeriod, extensionPeriod, repaymentPeriod, repaymentPeriodChange, id } = this.model;
    if (!id) return Validation.valid(this); // missing id shows pcr not created yet

    if (isNull(availabilityPeriod) || isNull(extensionPeriod) || isNull(repaymentPeriod)) {
      throw Error("validateRepaymentPeriod() is missing model data to validate.");
    }

    const totalPeriods = availabilityPeriod + extensionPeriod + repaymentPeriod;
    const repaymentPeriodPeriodDate = this.calculateOffsetDate(totalPeriods);

    return this.validateWholeMonths(
      "Repayment period",
      repaymentPeriodPeriodDate,
      repaymentPeriod,
      repaymentPeriodChange,
    );
  }

  private validateWholeMonths(
    errorKey: string,
    validateDate: Date,
    originalValue: number | null,
    updatedValue: number | null,
  ): Result {
    if (!this.isComplete) return Validation.valid(this);

    if (isNull(originalValue) || isNull(updatedValue)) {
      throw Error("validateWholeMonths() is missing 'originalValue' or 'updatedValue' to validate.");
    }

    return Validation.all(
      this,
      () => {
        const hasValueChanged = originalValue !== updatedValue;
        const isMonthsEditable = hasValueChanged ? this.checkInEditable(validateDate) : false;

        return Validation.isFalse(
          this,
          isMonthsEditable,
          this.getContent(x =>
            x.validation.pcrLoanExtensionItemDtoValidator.tooCloseToStart({
              name: errorKey,
              count: this.validationTolerance,
              value: originalValue,
            }),
          ),
        );
      },
      () => {
        const isDivisibleValid: boolean = updatedValue % this.validationTolerance === 0;

        return Validation.isTrue(
          this,
          isDivisibleValid,
          this.getContent(x =>
            x.validation.pcrLoanExtensionItemDtoValidator.notMultipleOf({
              name: errorKey,
              count: this.validationTolerance,
              value: updatedValue,
            }),
          ),
        );
      },
      () =>
        Validation.integer(
          this,
          updatedValue,
          this.getContent(x =>
            x.validation.pcrLoanExtensionItemDtoValidator.valueNotInteger({
              name: errorKey,
              value: updatedValue,
            }),
          ),
        ),
    );
  }
}
export class PCRLoanDrawdownChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForLoanDrawdownChangeDto> {}
export class PCRProjectTerminationItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForProjectTerminationDto> {}

export class PCRPeriodLengthChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPeriodLengthChangeDto> {}

export class PCRProjectSuspensionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForProjectSuspensionDto> {
  private readonly isComplete = this.model.status === PCRItemStatus.Complete;

  private validateSuspensionStartDate() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.suspensionStartDate,
        this.original && this.original.suspensionStartDate,
        this.getContent(x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionStartDateReadOnly),
      );
    }

    return Validation.all(
      this,
      () =>
        this.isComplete
          ? Validation.required(
              this,
              this.model.suspensionStartDate,
              this.getContent(
                x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionStartDateRequired,
              ),
            )
          : Validation.valid(this),
      () =>
        Validation.isDate(
          this,
          this.model.suspensionStartDate,
          this.getContent(x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionStartDateInvalid),
        ),
      () =>
        this.model.suspensionStartDate
          ? Validation.isTrue(
              this,
              DateTime.fromJSDate(this.model.suspensionStartDate).day === 1,
              this.getContent(
                x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionStartDateDayInvalid,
              ),
            )
          : Validation.valid(this),
    );
  }

  private validateSuspensionEndDate() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.suspensionEndDate,
        this.original && this.original.suspensionEndDate,
        this.getContent(x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionEndDateReadOnly),
      );
    }
    return Validation.all(
      this,
      () =>
        Validation.isDate(
          this,
          this.model.suspensionEndDate,
          this.getContent(x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionEndDateRequired),
        ),
      () =>
        this.model.suspensionEndDate
          ? Validation.isTrue(
              this,
              DateTime.fromJSDate(this.model.suspensionEndDate).plus({ days: 1 }).day === 1,
              this.getContent(
                x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionEndDateDayInvalid,
              ),
            )
          : Validation.valid(this),
      () =>
        this.model.suspensionEndDate
          ? Validation.isBeforeOrSameDay(
              this,
              this.model.suspensionStartDate,
              this.model.suspensionEndDate,
              this.getContent(x => x.validation.pcrProjectSuspensionItemDtoValidator.projectSuspensionDateRangeInvalid),
            )
          : Validation.valid(this),
    );
  }

  suspensionStartDate = this.validateSuspensionStartDate();
  suspensionEndDate = this.validateSuspensionEndDate();
}

export class PCRScopeChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForScopeChangeDto> {
  private validateProjectSummary() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.projectSummary,
        this.original && this.original.projectSummary,
        this.getContent(x => x.validation.pcrScopeChangeItemDtoValidator.projectSummaryReadOnly),
      );
    }

    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.required(
              this,
              this.model.projectSummary,
              this.getContent(x => x.validation.pcrScopeChangeItemDtoValidator.projectSummaryRequired),
            )
          : Validation.valid(this),
      () =>
        Validation.maxLength(
          this,
          this.model.projectSummary,
          PCRDtoValidator.maxSalesforceFieldLength,
          this.getContent(x =>
            x.validation.pcrScopeChangeItemDtoValidator.projectSummaryLengthTooLarge({
              count: PCRDtoValidator.maxSalesforceFieldLength,
            }),
          ),
        ),
    );
  }

  private validatePublicDescription() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.publicDescription,
        this.original && this.original.publicDescription,
        this.getContent(x => x.validation.pcrScopeChangeItemDtoValidator.publicDescriptionReadOnly),
      );
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;

    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.required(
              this,
              this.model.publicDescription,
              this.getContent(x => x.validation.pcrScopeChangeItemDtoValidator.publicDescriptionRequired),
            )
          : Validation.valid(this),
      () =>
        Validation.maxLength(
          this,
          this.model.publicDescription,
          PCRDtoValidator.maxSalesforceFieldLength,
          this.getContent(x =>
            x.validation.pcrScopeChangeItemDtoValidator.publicDescriptionLengthTooLarge({
              count: PCRDtoValidator.maxSalesforceFieldLength,
            }),
          ),
        ),
    );
  }

  projectSummary = this.validateProjectSummary();
  publicDescription = this.validatePublicDescription();
}

export class PCRPartnerAdditionItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPartnerAdditionDto> {
  private validateProjectRoleRequired() {
    if (!this.model.isProjectRoleAndPartnerTypeRequired) {
      return this.requiredIfComplete(
        this.model.projectRole || null,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectRoleRequired),
      );
    }
    return Validation.required(
      this,
      this.model.projectRole || null,
      this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectRoleRequired),
    );
  }
  private validatePartnerTypeRequired() {
    if (!this.model.isProjectRoleAndPartnerTypeRequired) {
      return this.requiredIfComplete(
        this.model.partnerType || null,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.partnerTypeRequired),
      );
    }
    return Validation.required(
      this,
      this.model.partnerType || null,
      this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.partnerTypeRequired),
    );
  }
  private validateIsCommercialWorkRequired() {
    if (!this.model.isProjectRoleAndPartnerTypeRequired) {
      return this.requiredIfComplete(
        this.model.isCommercialWork,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.commercialRequired),
      );
    }
    return Validation.required(
      this,
      this.model.isCommercialWork,
      this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.commercialRequired),
    );
  }
  private validateOrganisationNameRequired() {
    if (this.model.organisationType === PCROrganisationType.Industrial) return Validation.valid(this);
    return this.requiredIfComplete(
      this.model.organisationName,
      this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.organisationNameRequired),
    );
  }

  private validateProjectManagerDetailsRequired(value: Validation.ValidatableValue, message: string) {
    if (this.model.projectRole !== PCRProjectRole.ProjectLead) return Validation.valid(this);
    return this.requiredIfComplete(value, message);
  }

  private validateCompanyHouseDetailsRequired(value: Validation.ValidatableValue, message: string) {
    if (this.model.organisationType === PCROrganisationType.Academic) return Validation.valid(this);
    return this.requiredIfComplete(value, message);
  }

  spendProfile = Validation.nested(
    this,
    this.model?.spendProfile ?? {
      costs: [],
      funds: [],
      pcrItemId: undefined,
    },
    x => new PCRSpendProfileDtoValidator(x, this.showValidationErrors),
    this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.spendProfileInvalid),
  );

  projectRole = Validation.all(
    this,
    () => this.validateProjectRoleRequired(),
    () =>
      !this.canEdit || (this.original && this.original.projectRole)
        ? Validation.isUnchanged(
            this,
            this.model.projectRole,
            this.original && this.original.projectRole,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectRoleReadOnly),
          )
        : Validation.valid(this),
  );

  partnerType = Validation.all(
    this,
    () => this.validatePartnerTypeRequired(),
    () =>
      !this.canEdit || (this.original && this.original.partnerType)
        ? Validation.isUnchanged(
            this,
            this.model.partnerType,
            this.original && this.original.partnerType,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.partnerTypeReadOnly),
          )
        : Validation.valid(this),
  );

  isCommercialWork = Validation.all(
    this,
    () => this.validateIsCommercialWorkRequired(),
    () =>
      this.hasPermissionToEdit(
        this.model.isCommercialWork,
        this.original && this.original.isCommercialWork,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.commercialReadOnly),
      ),
  );

  organisationName = Validation.all(
    this,
    () => this.validateOrganisationNameRequired(),
    () =>
      this.hasPermissionToEdit(
        this.model.organisationName,
        this.original && this.original.organisationName,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.organisationNameReadOnly),
      ),
  );

  companyHouseOrganisationName = Validation.all(
    this,
    () =>
      this.validateCompanyHouseDetailsRequired(
        this.model.organisationName,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.organisationNameRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.organisationName,
        this.original && this.original.organisationName,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.organisationNameReadOnly),
      ),
  );

  registeredAddress = Validation.all(
    this,
    () =>
      this.validateCompanyHouseDetailsRequired(
        this.model.registeredAddress,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.registeredAddressRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.registeredAddress,
        this.original && this.original.registeredAddress,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.registeredAddressReadOnly),
      ),
  );

  registrationNumber = Validation.all(
    this,
    () =>
      this.validateCompanyHouseDetailsRequired(
        this.model.registrationNumber,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.registrationNumberRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.registrationNumber,
        this.original && this.original.registrationNumber,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.registrationNumberReadOnly),
      ),
  );

  financialYearEndDate = Validation.all(
    this,
    () =>
      this.model.organisationType === PCROrganisationType.Industrial
        ? this.requiredIfComplete(
            this.model.financialYearEndDate,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financialYearEndDateRequired),
          )
        : Validation.valid(this),
    () =>
      Validation.isDate(
        this,
        this.model.financialYearEndDate,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financialYearEndDateReadOnly),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.financialYearEndDate,
        this.original && this.original.financialYearEndDate,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financialYearEndDateInvalid),
      ),
  );

  financialYearEndTurnover = Validation.all(
    this,
    () =>
      this.model.organisationType === PCROrganisationType.Industrial
        ? this.requiredIfComplete(
            this.model.financialYearEndTurnover,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financialYearEndTurnoverRequired),
          )
        : Validation.valid(this),
    () =>
      Validation.isPositiveFloat(
        this,
        this.model.financialYearEndTurnover,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financialYearEndTurnoverTooSmall),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.financialYearEndTurnover,
        this.original && this.original.financialYearEndTurnover,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financialYearEndTurnoverReadOnly),
      ),
  );

  contact1ProjectRole = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.contact1ProjectRole,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactProjectRoleRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact1ProjectRole,
        this.original && this.original.contact1ProjectRole,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactProjectRoleReadOnly),
      ),
  );

  contact1Forename = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.contact1Forename,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactNameRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact1Forename,
        this.original && this.original.contact1Forename,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactNameReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact1Forename,
        50,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.financeContactNameLengthTooLarge({ count: 50 }),
        ),
      ),
  );

  contact1Surname = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.contact1Surname,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactSurnameRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact1Surname,
        this.original && this.original.contact1Surname,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactSurnameReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact1Surname,
        50,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.financeContactSurnameLengthTooLarge({ count: 50 }),
        ),
      ),
  );

  contact1Phone = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.contact1Phone,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactTelephoneNumberRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact1Phone,
        this.original && this.original.contact1Phone,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactTelephoneNumberReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact1Phone,
        20,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.financeContactTelephoneNumberLengthTooLarge({ count: 20 }),
        ),
      ),
  );

  contact1Email = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.contact1Email,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactEmailAddressRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact1Email,
        this.original && this.original.contact1Email,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.financeContactEmailAddressReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact1Email,
        255,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.financeContactEmailAddressLengthTooLarge({ count: 255 }),
        ),
      ),
  );

  contact2ProjectRole = Validation.all(
    this,
    () =>
      this.validateProjectManagerDetailsRequired(
        this.model.contact2ProjectRole,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerProjectRoleRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact2ProjectRole,
        this.original && this.original.contact2ProjectRole,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerProjectRoleReadOnly),
      ),
  );

  contact2Forename = Validation.all(
    this,
    () =>
      this.validateProjectManagerDetailsRequired(
        this.model.contact2Forename,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerNameRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact2Forename,
        this.original && this.original.contact2Forename,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerNameReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact2Forename,
        50,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.financeContactNameLengthTooLarge({ count: 50 }),
        ),
      ),
  );

  contact2Surname = Validation.all(
    this,
    () =>
      this.validateProjectManagerDetailsRequired(
        this.model.contact2Surname,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerSurnameRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact2Surname,
        this.original && this.original.contact2Surname,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerSurnameReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact2Surname,
        50,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.financeContactSurnameLengthTooLarge({ count: 50 }),
        ),
      ),
  );

  contact2Phone = Validation.all(
    this,
    () =>
      this.validateProjectManagerDetailsRequired(
        this.model.contact2Phone,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerTelephoneNumberRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact2Phone,
        this.original && this.original.contact2Phone,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerTelephoneNumberReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact2Phone,
        20,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerTelephoneNumberLengthTooLarge({ count: 20 }),
        ),
      ),
  );

  contact2Email = Validation.all(
    this,
    () =>
      this.validateProjectManagerDetailsRequired(
        this.model.contact2Email,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerEmailAddressRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.contact2Email,
        this.original && this.original.contact2Email,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerEmailAddressReadOnly),
      ),
    () =>
      Validation.maxLength(
        this,
        this.model.contact2Email,
        255,
        this.getContent(x =>
          x.validation.pcrPartnerAdditionItemDtoValidator.projectManagerEmailAddressLengthTooLarge({ count: 255 }),
        ),
      ),
  );

  projectLocation = Validation.all(
    this,
    () =>
      this.requiredIfStep(
        PCRStepId.projectLocationStep,
        this.model.projectLocation || null,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectLocationRequired),
      ),
    () =>
      this.requiredIfComplete(
        this.model.projectLocation || null,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectLocationRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.projectLocation,
        this.original && this.original.projectLocation,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectLocationReadOnly),
      ),
  );

  projectCity = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.projectCity,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectCityRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.projectCity,
        this.original && this.original.projectCity,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectCityReadOnly),
      ),
    () =>
      this.model.projectCity
        ? Validation.isTrue(
            this,
            this.model.projectCity.length <= 40,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectCityLengthTooLarge, {
              count: 40,
            }),
          )
        : Validation.valid(this),
  );

  projectPostcode = Validation.all(
    this,
    () =>
      this.hasPermissionToEdit(
        this.model.projectPostcode,
        this.original && this.original.projectPostcode,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.projectPostcodeReadOnly),
      ),
    () =>
      this.model.projectPostcode
        ? Validation.isTrue(
            this,
            this.model.projectPostcode.length <= 10,
            this.getContent(x =>
              x.validation.pcrPartnerAdditionItemDtoValidator.projectPostcodeLengthTooLarge({ count: 10 }),
            ),
          )
        : Validation.valid(this),
  );

  participantSize = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.participantSize || null,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.participantSizeRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.participantSize,
        this.original && this.original.participantSize,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.participantSizeReadOnly),
      ),
  );

  numberOfEmployees = Validation.all(
    this,
    () =>
      this.model.organisationType === PCROrganisationType.Industrial
        ? this.requiredIfComplete(
            this.model.numberOfEmployees,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.numberOfEmployeesRequired),
          )
        : Validation.valid(this),
    () =>
      Validation.isPositiveInteger(
        this,
        this.model.numberOfEmployees,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.numberOfEmployeesNotInteger),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.numberOfEmployees,
        this.original && this.original.numberOfEmployees,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.numberOfEmployeesReadOnly),
      ),
  );

  awardRate = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.awardRate,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.awardRateRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.awardRate,
        this.original && this.original.awardRate,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.awardRateReadOnly),
      ),
    () =>
      Validation.isPercentage(
        this,
        this.model.awardRate,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.awardRateNotPercentage),
      ),
    () =>
      Validation.isTrue(
        this,
        !this.model.awardRate || this.model.awardRate <= 100,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.awardRateTooLarge),
      ),
  );

  hasOtherFunding = Validation.all(
    this,
    () =>
      this.requiredIfComplete(
        this.model.hasOtherFunding,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.otherFundingOptionRequired),
      ),
    () =>
      this.hasPermissionToEdit(
        this.model.hasOtherFunding,
        this.original && this.original.hasOtherFunding,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.otherFundingOptionReadOnly),
      ),
  );

  // No validator for `totalOtherFunding` as it is updated automatically rather than via a form

  tsbReference = Validation.all(
    this,
    () =>
      this.model.organisationType === PCROrganisationType.Academic
        ? this.requiredIfComplete(
            this.model.tsbReference,
            this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.tsbReferenceRequired),
          )
        : Validation.valid(this),
    () =>
      this.hasPermissionToEdit(
        this.model.tsbReference,
        this.original && this.original.tsbReference,
        this.getContent(x => x.validation.pcrPartnerAdditionItemDtoValidator.tsbReferenceReadOnly),
      ),
  );
}

export class PCRAccountNameChangeItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForAccountNameChangeDto> {
  private validateAccountName() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.accountName,
        this.original && this.original.accountName,
        this.getContent(x => x.validation.pcrAccountNameChangeItemDtoValidator.accountNameReadOnly),
      );
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.required(
              this,
              this.model.accountName,
              this.getContent(x => x.validation.pcrAccountNameChangeItemDtoValidator.accountNameRequired),
            )
          : Validation.valid(this),

      // If a partner is selected, check if old partner name is unequal to new partner name
      () =>
        this.model.partnerId
          ? Validation.isTrue(
              this,
              this.model.partnerNameSnapshot !== this.model.accountName,
              this.getContent(x => x.validation.pcrAccountNameChangeItemDtoValidator.accountNameIdentical),
            )
          : Validation.valid(this),
    );
  }

  private validatePartnerId() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.partnerId,
        this.original && this.original.partnerId,
        this.getContent(x => x.validation.pcrAccountNameChangeItemDtoValidator.partnerIdReadOnly),
      );
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.required(
              this,
              this.model.partnerId,
              this.getContent(x => x.validation.pcrAccountNameChangeItemDtoValidator.partnerIdRequired),
            )
          : Validation.valid(this),
      () =>
        this.partners && this.model.partnerId
          ? Validation.permittedValues(
              this,
              this.model.partnerId,
              this.partners.filter(x => !x.isWithdrawn).map(x => x.id),
              this.getContent(x => x.validation.pcrAccountNameChangeItemDtoValidator.partnerIdInvalid),
            )
          : Validation.valid(this),
    );
  }

  accountName = this.validateAccountName();
  partnerId = this.validatePartnerId();
}

export class PCRPartnerWithdrawalItemDtoValidator extends PCRBaseItemDtoValidator<PCRItemForPartnerWithdrawalDto> {
  private validateRemovalPeriod() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.removalPeriod,
        this.original && this.original.removalPeriod,
        this.getContent(x => x.validation.pcrPartnerWithdrawalItemDtoValidator.periodReadOnly),
      );
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.required(
              this,
              this.model.removalPeriod,
              this.getContent(x => x.validation.pcrPartnerWithdrawalItemDtoValidator.periodRequired),
            )
          : Validation.valid(this),
      () =>
        Validation.integer(
          this,
          this.model.removalPeriod,
          this.getContent(x => x.validation.pcrPartnerWithdrawalItemDtoValidator.periodNotInteger),
        ),
      () =>
        this.project && this.model.removalPeriod
          ? Validation.isTrue(
              this,
              this.model.removalPeriod > 0 && this.model.removalPeriod <= this.project.numberOfPeriods,
              this.getContent(x =>
                x.validation.pcrPartnerWithdrawalItemDtoValidator.periodInvalid({
                  count: this.project?.numberOfPeriods,
                }),
              ),
            )
          : Validation.valid(this),
    );
  }

  private validatePartnerId() {
    if (!this.canEdit) {
      return Validation.isUnchanged(
        this,
        this.model.partnerId,
        this.original && this.original.partnerId,
        this.getContent(x => x.validation.pcrPartnerWithdrawalItemDtoValidator.partnerIdReadOnly),
      );
    }
    const isComplete = this.model.status === PCRItemStatus.Complete;
    return Validation.all(
      this,
      () =>
        isComplete
          ? Validation.required(
              this,
              this.model.partnerId,
              this.getContent(x => x.validation.pcrPartnerWithdrawalItemDtoValidator.partnerIdRequired),
            )
          : Validation.valid(this),
      () =>
        this.partners && this.model.partnerId
          ? Validation.permittedValues(
              this,
              this.model.partnerId,
              this.partners.filter(x => !x.isWithdrawn).map(x => x.id),
              this.getContent(x => x.validation.pcrPartnerWithdrawalItemDtoValidator.partnerIdInvalid),
            )
          : Validation.valid(this),
    );
  }

  removalPeriod = this.validateRemovalPeriod();
  partnerId = this.validatePartnerId();
}
