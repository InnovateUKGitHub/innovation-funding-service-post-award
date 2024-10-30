import { CostCategoryGroupType, CostCategoryType } from "@framework/constants/enums";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { CostCategoryList } from "@framework/types/CostCategory";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useMounted } from "@ui/context/Mounted";
import { Content } from "@ui/components/molecules/Content/content";
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
  const costCategoryInfo = new CostCategoryList(project.competitionType).fromId(costCategory.type);
  const isOtherCosts = costCategoryInfo.group === CostCategoryGroupType.Other_Costs;
  const isVAT = costCategory.type === CostCategoryType.VAT;

  return (
    <>
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
    </>
  );
};

export { GuidanceSection };
