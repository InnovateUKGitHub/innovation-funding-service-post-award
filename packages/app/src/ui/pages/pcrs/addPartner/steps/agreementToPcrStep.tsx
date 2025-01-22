import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../../filesStep/filesStep";
import { Section } from "@ui/components/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnUpdateAddPartnerAgreementToPcr } from "./agreementToPcr.logic";

export const AgreementToPCRStep = () => {
  const { getContent } = useContent();
  const { onUpdate, isFetching, apiError } = useOnUpdateAddPartnerAgreementToPcr();
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
      formType={FormTypes.PcrAddPartnerAgreementFilesStep}
      apiError={apiError}
      onUpdate={onUpdate}
      isFetching={isFetching}
    />
  );
};
