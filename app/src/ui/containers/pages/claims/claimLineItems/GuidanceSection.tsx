import { CostCategoryType } from "@framework/constants/enums";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";

interface GuidanceSectionProps {
  project: Pick<ProjectDto, "competitionType">;
  costCategory: Pick<CostCategoryDto, "type">;
}

const GuidanceSection = ({ project, costCategory }: GuidanceSectionProps) => {
  const { getContent } = useContent();
  const { isClient, isServer } = useMounted();
  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);
  const isOtherCosts = costCategory.type === CostCategoryType.Other_Costs;
  const isVAT = costCategory.type === CostCategoryType.VAT;

  return (
    <Section>
      {isCombinationOfSBRI ? (
        <>
          {isOtherCosts && (
            <SimpleString qa="other-costs-guidance-message">
              <Content value={x => x.claimsMessages.editClaimLineItemOtherCostsTotalCosts} />
            </SimpleString>
          )}
          {(isOtherCosts || isVAT) && (
            <>
              <SimpleString qa="vat-registered">
                <Content value={x => x.claimsMessages.editClaimLineItemVatRegistered} />
              </SimpleString>
              <SimpleString qa="vat-contact-mo">
                <Content value={x => x.claimsMessages.editClaimLineItemContactMo} />
              </SimpleString>
            </>
          )}
        </>
      ) : (
        !isKTP && (
          <SimpleString qa="guidance-message">
            {getContent(x => x.claimsMessages.editClaimLineItemGuidance)}
          </SimpleString>
        )
      )}

      <SimpleString qa="guidance-currency-message">
        {isClient && getContent(x => x.claimsMessages.editClaimLineItemConvertGbp)}
        {isServer && getContent(x => x.claimsMessages.nonJsEditClaimLineItemConvertGbp)}
      </SimpleString>
    </Section>
  );
};

export { GuidanceSection };
