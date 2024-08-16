import { Section } from "@ui/components/atoms/Section/Section";
import { getPartnerName } from "@ui/components/organisms/partners/utils/partnerName";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useRemovePartnerWorkflowQuery } from "./removePartner.logic";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNextLink } from "../utils/useNextLink";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { PcrPage } from "../pcrPage";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { getRemovePartnerSchema, removePartnerErrorMap, RemovePartnerSchemaType } from "./removePartner.zod";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";
import { Label } from "@ui/components/atoms/form/Label/Label";

export const RemovePartnerStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

  const { partners, pcrItem, project } = useRemovePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { handleSubmit, register, formState, trigger, watch, setError } = useForm<RemovePartnerSchemaType>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      removalPeriod: pcrItem.removalPeriod,
      partnerId: pcrItem.partnerId,
      form: FormTypes.PcrRemovePartnerStep,
    },
    resolver: zodResolver(getRemovePartnerSchema(project.numberOfPeriods), {
      errorMap: removePartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const partnerOptions = partners
    .filter(x => !x.isWithdrawn)
    .map(x => ({
      id: x.id,
      label: getPartnerName(x),
    }));

  const nextLink = useNextLink();

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <Form
          onSubmit={handleSubmit(data => {
            onSave({ data, context: { link: nextLink } });
          })}
        >
          <input type="hidden" name="form" value={FormTypes.PcrRemovePartnerStep} />
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrRemovePartner.headingSelectPartner)}</Legend>
            <FormGroup hasError={!!validationErrors?.partnerId}>
              <ValidationError error={validationErrors?.partnerId as RhfErrors} />
              <RadioList name="partnerId" register={register}>
                {partnerOptions.map(partner => (
                  <Radio
                    key={partner.id}
                    id={partner.id}
                    label={partner.label}
                    disabled={isFetching}
                    defaultChecked={!!pcrItem?.partnerId && pcrItem.partnerId === partner.id}
                  ></Radio>
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <FormGroup hasError={!!validationErrors?.removalPeriod}>
              <Label bold htmlFor="removalPeriod">
                {getContent(x => x.pages.pcrRemovePartner.headingRemovalPeriod)}
              </Label>
              <Hint id="hint-for-removalPeriod">{getContent(x => x.pages.pcrRemovePartner.hintRemovalPeriod)}</Hint>
              <ValidationError error={validationErrors?.removalPeriod as RhfErrors} />
              <NumberInput
                aria-label={getContent(x => x.pcrRemovePartnerLabels.removalPeriod)}
                aria-describedby="hint-for-removalPeriod"
                inputWidth={3}
                id="removalPeriod"
                disabled={isFetching}
                defaultValue={pcrItem.removalPeriod ?? ""}
                {...register("removalPeriod")}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button disabled={isFetching} type="submit">
              {getContent(x => x.pcrItem.submitButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
