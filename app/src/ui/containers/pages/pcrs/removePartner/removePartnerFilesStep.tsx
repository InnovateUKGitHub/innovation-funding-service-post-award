import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../filesStep/filesStep";

export const RemovePartnerFilesStep = () => {
  return (
    <FilesStep
      guidance={x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidance}
      heading={x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidanceHeading}
      documentDescription={DocumentDescription.WithdrawalOfPartnerCertificate}
    />
  );
};
