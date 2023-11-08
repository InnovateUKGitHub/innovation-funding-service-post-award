import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../filesStep/filesStep";

export const RenamePartnerFilesStep = () => {
  return (
    <FilesStep
      heading={x => x.pages.pcrNameChangePrepareItemFiles.headingUploadCertificate}
      documentDescription={DocumentDescription.CertificateOfNameChange}
    />
  );
};
