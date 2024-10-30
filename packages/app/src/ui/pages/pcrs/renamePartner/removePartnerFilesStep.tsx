import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../filesStep/filesStep";

export const RemovePartnerFilesStep = () => {
  return (
    <FilesStep
      heading={x => x.pages.pcrNameChangePrepareItemFiles.headingUploadCertificate}
      documentDescription={DocumentDescription.CertificateOfNameChange}
    />
  );
};
