import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../filesStep/filesStep";
import { FormTypes } from "@ui/zod/FormTypes";

export const RenamePartnerFilesStep = () => {
  return (
    <FilesStep
      heading={x => x.pages.pcrNameChangePrepareItemFiles.headingUploadCertificate}
      documentDescription={DocumentDescription.CertificateOfNameChange}
      formType={FormTypes.PcrRenamePartnerFilesStep}
    />
  );
};
