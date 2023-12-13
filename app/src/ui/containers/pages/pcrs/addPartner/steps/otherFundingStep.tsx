import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useSummaryLink } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { OtherFundingSchema, otherFundingSchema } from "./schemas/otherFunding.zod";

const options = [
  {
    value: "true",
    label: <Content value={x => x.pcrAddPartnerLabels.otherFundsYes} />,
  },
  {
    value: "false",
    label: <Content value={x => x.pcrAddPartnerLabels.otherFundsNo} />,
  },
];

export const OtherFundingStep = () => {
  const { getContent } = useContent();
  const { projectId, pcrId, itemId, fetchKey, useFormValidate, onSave, isFetching, routes } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const summaryLink = useSummaryLink();
  const { handleSubmit, register, formState, trigger, setValue } = useForm<OtherFundingSchema>({
    defaultValues: {
      button_submit: "submit",
      hasOtherFunding: pcrItem.hasOtherFunding ? "true" : "false",
    },
    resolver: zodResolver(otherFundingSchema, {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

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
          onSubmit={handleSubmit(data =>
            onSave({
              data: {
                ...data,
                hasOtherFunding: data.hasOtherFunding === "true",
              },
              context: getNextLink(data),
            }),
          )}
        >
          <Fieldset>
            <FormGroup>
              <RadioList
                name="hasOtherFunding"
                aria-label={getContent(x => x.pages.pcrAddPartnerOtherFunding.labelOtherSourcesQuestion)}
                register={register}
              >
                {options.map(x => (
                  <Radio key={x.value} id={x.value} value={x.value} label={x.label} disabled={isFetching} />
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.returnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
