import { DocumentDescription } from "@framework/constants/documentDescription";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { WithPcrFilesStep } from "../utils/filesStepHoc";

export const PCRPrepareItemFilesForPartnerWithdrawalStep = WithPcrFilesStep<
  PCRItemForPartnerWithdrawalDto,
  PCRPartnerWithdrawalItemDtoValidator
>({
  heading: x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidanceHeading,
  guidance: x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidance,
  documentDescription: DocumentDescription.WithdrawalOfPartnerCertificate,
});
