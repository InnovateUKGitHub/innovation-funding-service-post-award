import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Section } from "@ui/components/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";

const ClaimLineItemClaimDetailComments = ({ claimDetails }: { claimDetails: Pick<ClaimDetailsDto, "comments"> }) => {
  const { getContent } = useContent();

  return (
    <>
      {claimDetails.comments && (
        <Section title={getContent(x => x.pages.claimLineItems.additionalInfoTitle)} qa="additional-information">
          <P>{claimDetails.comments}</P>
        </Section>
      )}
    </>
  );
};

export { ClaimLineItemClaimDetailComments };
