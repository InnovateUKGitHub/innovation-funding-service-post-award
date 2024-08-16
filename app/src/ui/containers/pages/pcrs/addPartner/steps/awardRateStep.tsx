import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { PcrPage } from "../../pcrPage";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { useContent } from "@ui/hooks/content.hook";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { AwardRateSchema, getAwardRateSchema } from "./schemas/awardRate.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";

export const AwardRateStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue, watch, setError } = useForm<AwardRateSchema>({
    defaultValues: {
      form: FormTypes.PcrAddPartnerAwardRateStep,
      button_submit: "submit",
      awardRate: pcrItem.awardRate,
      markedAsComplete: String(markedAsCompleteHasBeenChecked),
    },
    resolver: zodResolver(getAwardRateSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section title={x => x.pages.pcrAddPartnerAwardRate.formSectionTitle}>
        <Content markdown value={x => x.pages.pcrAddPartnerAwardRate.guidance} />
        <br />
        <Form data-qa="addPartnerForm" onSubmit={handleSubmit(data => onSave({ data, context: link(data) }))}>
          <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerAwardRateStep} />
          <input type="hidden" {...register("markedAsComplete")} value={String(markedAsCompleteHasBeenChecked)} />

          <Fieldset>
            <FormGroup hasError={!!validationErrors?.awardRate}>
              <ValidationError error={validationErrors?.awardRate as RhfError} />
              <NumberInput
                hasError={!!validationErrors?.awardRate}
                inputWidth={4}
                defaultValue={String(pcrItem.awardRate ?? 0)}
                {...register("awardRate")}
                disabled={isFetching}
                suffix={getContent(x => x.forms.suffix.percent)}
              />
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
