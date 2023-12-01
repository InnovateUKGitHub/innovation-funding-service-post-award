import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { otherFundingErrorMap, otherFundingSchema, OtherFundingSchema } from "../addPartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";

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
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();
  const { handleSubmit, register, formState, trigger, setValue } = useForm<OtherFundingSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      button_submit: "submit",
      hasOtherFunding: pcrItem.hasOtherFunding ? "true" : "false",
    },
    resolver: zodResolver(otherFundingSchema, {
      errorMap: otherFundingErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");
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
              context: link(data),
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
