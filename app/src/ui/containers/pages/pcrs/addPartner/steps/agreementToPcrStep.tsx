import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../../filesStep/filesStep";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";

export const AgreementToPCRStep = () => {
  const { getContent } = useContent();
  return (
    <FilesStep
      heading={x => x.pages.pcrAddPartnerAgreementToPcr.heading}
      guidanceComponent={
        <Section>
          <P>{getContent(x => x.pages.pcrAddPartnerAgreementToPcr.guidance)}</P>
        </Section>
      }
      documentDescription={DocumentDescription.AgreementToPCR}
      returnToSummaryButton
    />
  );
};
