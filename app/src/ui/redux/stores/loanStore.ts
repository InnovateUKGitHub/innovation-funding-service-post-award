import { storeKeys } from "@ui/redux/stores/storeKeys";
import { Pending } from "@shared/pending";
import { LoanDto } from "@framework/dtos";
import { LoanDtoValidator } from "@ui/validators/loanValidator";
import { apiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { messageSuccess, RootActionsOrThunk } from "../actions";
import { LoanDocumentsStore } from "./loanDocumentsStore";
import { StoreBase } from "./storeBase";

export class LoansStore extends StoreBase {
  constructor(
    private readonly loanDocumentsStore: LoanDocumentsStore,
    getState: () => RootState,
    dispatch: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, dispatch);
  }

  private getKey(projectId: string, loanId: string | undefined, periodId?: number | undefined): string {
    if (loanId) {
      return storeKeys.getLoanKey(projectId, loanId);
    }

    if (periodId) {
      return storeKeys.getLoanByPeriod(projectId, periodId);
    }

    throw Error("You must supply param after projectId for getKey to work.");
  }

  public getAll(projectId: string): Pending<LoanDto[]> {
    return this.getData("loans", storeKeys.getLoansKey(projectId), p => apiClient.loans.getAll({ ...p, projectId }));
  }

  public get(projectId: string, loanId?: string, periodId?: number): Pending<LoanDto> {
    return this.getData("loan", this.getKey(projectId, loanId, periodId), p =>
      apiClient.loans.get({ ...p, projectId, loanId, periodId }),
    );
  }

  public update(loan: LoanDto, projectId: string, loanId: string): Pending<LoanDto> {
    return this.getData("loan", this.getKey(projectId, loanId), p =>
      apiClient.loans.update({ ...p, projectId, loanId, loan }),
    );
  }

  public getLoanEditor(projectId: string, loanId: string, init?: (dto: LoanDto) => void) {
    return this.getEditor(
      "loan",
      this.getKey(projectId, loanId),
      () => this.get(projectId, loanId),
      init,
      dto => this.validate(dto, projectId, loanId, false),
    );
  }

  public updateLoanEditor(
    projectId: string,
    loanId: string,
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
    projectId: string,
    loanId: string,
    showErrors: boolean,
  ): Pending<LoanDtoValidator> {
    const documents = this.loanDocumentsStore.getLoanDocuments(projectId, loanId);

    return documents.then(loanDocs => new LoanDtoValidator(loanDto, loanDocs, showErrors));
  }
}
