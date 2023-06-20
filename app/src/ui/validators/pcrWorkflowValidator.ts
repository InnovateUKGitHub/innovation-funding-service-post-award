import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { CombinedResultsValidator } from "@ui/validation/results";

export class PCRWorkflowValidator extends CombinedResultsValidator {
  constructor(
    private readonly pcrValidator: PCRDtoValidator,
    private readonly filesValidator: MultipleDocumentUploadDtoValidator,
  ) {
    super(pcrValidator, filesValidator);
  }
  public pcr = this.pcrValidator;
  public files = this.filesValidator;
}
