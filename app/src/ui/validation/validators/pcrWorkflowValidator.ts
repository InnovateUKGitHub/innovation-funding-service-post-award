import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { CombinedResultsValidator } from "@ui/validation/results";

export class PCRWorkflowValidator extends CombinedResultsValidator {
  public pcr: PCRDtoValidator;
  public files: MultipleDocumentUploadDtoValidator;

  constructor(
    private readonly pcrValidator: PCRDtoValidator,
    private readonly filesValidator: MultipleDocumentUploadDtoValidator,
  ) {
    super(pcrValidator, filesValidator);
    this.pcr = pcrValidator;
    this.files = filesValidator;
  }
}
