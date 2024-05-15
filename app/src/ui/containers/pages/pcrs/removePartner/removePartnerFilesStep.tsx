import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../filesStep/filesStep";
import { FormTypes } from "@ui/zod/FormTypes";

export const RemovePartnerFilesStep = () => {
  return (
    <FilesStep
      guidance={x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidance}
      heading={x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidanceHeading}
      documentDescription={DocumentDescription.WithdrawalOfPartnerCertificate}
      formType={FormTypes.PcrRemovePartnerFilesStep}
    />
  );
};
