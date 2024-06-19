import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useSummaryLink } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { OtherFundingSchema, otherFundingSchema } from "./schemas/otherFunding.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { useMemo } from "react";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const OtherFundingStep = () => {
  const { getContent } = useContent();
  const { projectId, pcrId, itemId, fetchKey, onSave, isFetching, routes, markedAsCompleteHasBeenChecked } =
    usePcrWorkflowContext();

  const { pcrSpendProfile, academicCostCategories, spendProfileCostCategories, pcrItem } = useAddPartnerWorkflowQuery(
    projectId,
    itemId,
    fetchKey,
  );

  const { spendProfile } = useMemo(() => {
    const costCategoryList =
      pcrItem.organisationType === PCROrganisationType.Academic ? academicCostCategories : spendProfileCostCategories;

    const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, costCategoryList);
    return { spendProfile };
  }, [itemId, pcrSpendProfile, academicCostCategories, spendProfileCostCategories, pcrItem]);

  const summaryLink = useSummaryLink();
  const { handleSubmit, register, formState, trigger, setValue, watch, setError } = useForm<OtherFundingSchema>({
    defaultValues: {
      form: FormTypes.PcrAddPartnerOtherFundingStep,
      button_submit: "submit",
      hasOtherFunding: pcrItem.hasOtherFunding ? "true" : "false",
    },
    resolver: zodResolver(otherFundingSchema, {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const getNextLink = (data: OtherFundingSchema) => {
    return {
      link:
        data.button_submit === "submit"
          ? routes.pcrPrepareItem.getLink({
              projectId,
              pcrId,
              itemId,
              step: data.hasOtherFunding === "true" ? 12 : 13,
            })
          : summaryLink,
    };
  };

  return (
    <PcrPage validationErrors={validationErrors}>
      <H2>{getContent(x => x.pages.pcrAddPartnerOtherFunding.formSectionTitle)}</H2>
      <Section>
        <Content markdown value={x => x.pages.pcrAddPartnerOtherFunding.guidance} />
      </Section>
      <Section>
        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data => {
            const hasOtherFunding = data.hasOtherFunding === "true";
            const funds = hasOtherFunding
              ? {}
              : {
                  spendProfile: {
                    ...spendProfile,
                    funds: [],
                  },
                };

            onSave({
              data: {
                ...data,
                ...funds,
                hasOtherFunding,
              },
              context: getNextLink(data),
            });
          })}
        >
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerOtherFundingStep} />
          <Fieldset>
            <FormGroup>
              <RadioList
                name="hasOtherFunding"
                aria-label={getContent(x => x.pages.pcrAddPartnerOtherFunding.labelOtherSourcesQuestion)}
                register={register}
              >
                <Radio
                  id="true"
                  value="true"
                  label={<Content value={x => x.pcrAddPartnerLabels.otherFundsYes} />}
                  disabled={isFetching}
                  defaultChecked={!!pcrItem.hasOtherFunding}
                />
                <Radio
                  id="false"
                  value="false"
                  label={<Content value={x => x.pcrAddPartnerLabels.otherFundsNo} />}
                  disabled={isFetching}
                  defaultChecked={!pcrItem.hasOtherFunding}
                />
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
