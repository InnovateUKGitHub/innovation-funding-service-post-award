import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PcrPage } from "../../pcrPage";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { useContent } from "@ui/hooks/content.hook";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { AwardRateSchema, getAwardRateSchema } from "./schemas/awardRate.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

export const AwardRateStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue, watch } = useForm<AwardRateSchema>({
    defaultValues: {
      button_submit: "submit",
      awardRate: pcrItem.awardRate,
    },
    resolver: zodResolver(getAwardRateSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section title={x => x.pages.pcrAddPartnerAwardRate.formSectionTitle}>
        <Content markdown value={x => x.pages.pcrAddPartnerAwardRate.guidance} />
        <Form data-qa="addPartnerForm" onSubmit={handleSubmit(data => onSave({ data, context: link(data) }))}>
          <Fieldset>
            <FormGroup hasError={!!validationErrors?.awardRate}>
              <ValidationError error={validationErrors?.awardRate as RhfError} />
              <NumberInput
                hasError={!!validationErrors?.awardRate}
                inputWidth={4}
                {...register("awardRate")}
                disabled={isFetching}
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
