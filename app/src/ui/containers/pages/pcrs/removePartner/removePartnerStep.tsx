import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { getPartnerName } from "@ui/components/atomicDesign/organisms/partners/utils/partnerName";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useRemovePartnerWorkflowQuery } from "./removePartner.logic";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNextLink } from "../utils/useNextLink";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { getRemovePartnerSchema, removePartnerErrorMap, RemovePartnerSchemaType } from "./removePartner.zod";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";

export const RemovePartnerStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked, useFormValidate } =
    usePcrWorkflowContext();

  const { partners, pcrItem, project } = useRemovePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { handleSubmit, register, formState, trigger } = useForm<RemovePartnerSchemaType>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      removalPeriod: pcrItem.removalPeriod,
      partnerId: pcrItem.partnerId,
    },
    resolver: zodResolver(getRemovePartnerSchema(project.numberOfPeriods), {
      errorMap: removePartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

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
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrRemovePartner.headingSelectPartner)}</Legend>
            <FormGroup>
              <RadioList name="partnerId" register={register}>
                {partnerOptions.map(partner => (
                  <Radio key={partner.id} id={partner.id} label={partner.label} disabled={isFetching}></Radio>
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Legend> {getContent(x => x.pages.pcrRemovePartner.headingRemovalPeriod)}</Legend>
            <FormGroup hasError={!!validationErrors?.removalPeriod}>
              <Hint id="hint-for-removalPeriod">{getContent(x => x.pages.pcrRemovePartner.hintRemovalPeriod)}</Hint>
              <ValidationError error={validationErrors?.removalPeriod as RhfErrors} />
              <NumberInput
                aria-label={getContent(x => x.pcrRemovePartnerLabels.removalPeriod)}
                aria-describedby="hint-for-removalPeriod"
                inputWidth={3}
                id="removalPeriod"
                disabled={isFetching}
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
