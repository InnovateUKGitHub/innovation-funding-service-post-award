import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";

const isNotAuthorOfLineItems = (claimDetails: { isAuthor: boolean; lineItems: { isAuthor: boolean }[] }) =>
  !claimDetails.isAuthor || claimDetails.lineItems.some(x => !x.isAuthor);

const DeleteByEnteringZero = () => (
  <ValidationMessage
    messageType="info"
    qa="claim-warning"
    message={<Content value={x => x.pages.editClaimLineItems.setToZeroToRemove} />}
  />
);

export { DeleteByEnteringZero, isNotAuthorOfLineItems };
