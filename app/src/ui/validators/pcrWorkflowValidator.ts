import { CombinedResultsValidator } from "@ui/validation";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";

export class PCRWorkflowValidator extends CombinedResultsValidator {
  constructor(private readonly pcrValidator: PCRDtoValidator, private readonly filesValidator: MultipleDocumentUpdloadDtoValidator) {
    super(pcrValidator, filesValidator);
  }
  public pcr = this.pcrValidator;
  public files = this.filesValidator;
}
