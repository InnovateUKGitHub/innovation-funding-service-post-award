import { DocumentDescription } from "@framework/constants/documentDescription";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { WithPcrFilesStep } from "../utils/filesStepHoc";

export const PCRPrepareItemFilesStep = WithPcrFilesStep<
  PCRItemForAccountNameChangeDto,
  PCRAccountNameChangeItemDtoValidator
>({
  heading: x => x.pages.pcrNameChangePrepareItemFiles.headingUploadCertificate,
  documentDescription: DocumentDescription.CertificateOfNameChange,
});
