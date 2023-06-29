import { storeKeys } from "@ui/redux/stores/storeKeys";
import { Pending } from "@shared/pending";
import { LoanDtoValidator } from "@ui/validation/validators/loanValidator";
import { apiClient } from "../../apiClient";
import { LoanDocumentsStore } from "./loanDocumentsStore";
import { StoreBase } from "./storeBase";
import { LoanDto } from "@framework/dtos/loanDto";
import { messageSuccess } from "../actions/common/messageActions";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";

export class LoansStore extends StoreBase {
  constructor(
    private readonly loanDocumentsStore: LoanDocumentsStore,
    getState: () => RootState,
    dispatch: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, dispatch);
  }

  private getKey(projectId: ProjectId, loanId: LoanId | undefined, periodId?: number | undefined): string {
    if (loanId) {
      return storeKeys.getLoanKey(projectId, loanId);
    }

    if (periodId) {
      return storeKeys.getLoanByPeriod(projectId, periodId);
    }

    throw Error("You must supply param after projectId for getKey to work.");
  }

  public getAll(projectId: ProjectId): Pending<LoanDto[]> {
    return this.getData("loans", storeKeys.getLoansKey(projectId), p => apiClient.loans.getAll({ ...p, projectId }));
  }

  public get(projectId: ProjectId, loanId?: LoanId, periodId?: number): Pending<LoanDto> {
    return this.getData("loan", this.getKey(projectId, loanId, periodId), p =>
      apiClient.loans.get({ ...p, projectId, loanId, periodId }),
    );
  }

  public update(loan: LoanDto, projectId: ProjectId, loanId: LoanId): Pending<LoanDto> {
    return this.getData("loan", this.getKey(projectId, loanId), p =>
      apiClient.loans.update({ ...p, projectId, loanId, loan }),
    );
  }

  public getLoanEditor(projectId: ProjectId, loanId: LoanId, init?: (dto: LoanDto) => void) {
    return this.getEditor(
      "loan",
      this.getKey(projectId, loanId),
      () => this.get(projectId, loanId),
      init,
      dto => this.validate(dto, projectId, loanId, false),
    );
  }

  public updateLoanEditor(
    projectId: ProjectId,
    loanId: LoanId,
    dto: LoanDto,
    message?: string,
    onComplete?: (result: LoanDto) => void,
  ): void {
    this.updateEditor(
      true,
      "loan",
      this.getKey(projectId, loanId),
      dto,
      showErrors => this.validate(dto, projectId, loanId, showErrors),
      p => apiClient.loans.update({ projectId, loanId, loan: dto, ...p }),
      result => {
        this.markStale("loan", this.getKey(projectId, loanId), result);

        if (message) this.queue(messageSuccess(message));

        onComplete?.(result);
      },
    );
  }

  private validate(
    loanDto: LoanDto,
    projectId: ProjectId,
    loanId: LoanId,
    showErrors: boolean,
  ): Pending<LoanDtoValidator> {
    const documents = this.loanDocumentsStore.getLoanDocuments(projectId, loanId);

    return documents.then(loanDocs => new LoanDtoValidator(loanDto, loanDocs, showErrors));
  }
}
