import { useContent } from "@ui/hooks/content.hook";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { FilesStep } from "../../filesStep/filesStep";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { LinksList } from "@ui/components/atomicDesign/atoms/LinksList/linksList";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";

const DeMinimisGuidance = () => {
  const { getContent } = useContent();

  return (
    <>
      <Section qa="de-minimis-intro" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleDeMinimis}>
        <Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceDeMinimis} />
      </Section>

      <Section>
        <H3>{getContent(x => x.pages.pcrAddPartnerStateAidEligibility.sectionTitleTemplate)}</H3>

        <LinksList
          openNewWindow
          links={[
            {
              url: "/ifspa-assets/pcr_templates/de-minimis-declaration.odt",
              text: getContent(x => x.pcrAddPartnerLabels.deMinimisDeclarationForm),
            },
          ]}
        />
      </Section>

      <H3>{getContent(x => x.pages.pcrAddPartnerStateAidEligibility.sectionTitleUploadDeclaration)}</H3>
    </>
  );
};

export const DeMinimisStep = () => {
  return (
    <FilesStep
      documentDescription={DocumentDescription.DeMinimisDeclarationForm}
      guidanceComponent={<DeMinimisGuidance />}
      returnToSummaryButton
    />
  );
};
