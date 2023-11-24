import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";

interface NegativeClaimWarningProps {
  claimDetails: {
    lineItems: Pick<ClaimLineItemDto, "value" | "description">[];
  };
}

const NegativeClaimWarning = ({ claimDetails }: NegativeClaimWarningProps) => {
  const errorItems = claimDetails.lineItems.filter(x => x.value < 0).map(x => x.description);

  if (!errorItems.length) return null;

  const errorItemsList = errorItems.map(costCategory => <li key={costCategory}>{costCategory}</li>);
  const markup = (
    <>
      <SimpleString>
        <Content value={x => x.claimsMessages.negativeClaimWarning} />
      </SimpleString>

      <UL>{errorItemsList}</UL>
    </>
  );

  return <ValidationMessage messageType="info" qa="claim-warning" message={markup} />;
};

export { NegativeClaimWarning };
