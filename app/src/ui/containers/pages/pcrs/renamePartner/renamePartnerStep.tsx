import { Section } from "@ui/components/atoms/Section/Section";
import { getPartnerName } from "@ui/components/organisms/partners/utils/partnerName";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useRenamePartnerWorkflowQuery } from "./renamePartner.logic";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNextLink } from "../utils/useNextLink";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { PcrPage } from "../pcrPage";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { getRenamePartnerSchema, renamePartnerErrorMap, RenamePartnerSchemaType } from "./renamePartner.zod";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";
import { Label } from "@ui/components/atoms/form/Label/Label";

export const RenamePartnerStep = () => {
  const { getContent } = useContent();
  const {
    projectId,
    itemId,
    pcrId,
    fetchKey,
    getRequiredToCompleteMessage,
    onSave,
    isFetching,
    markedAsCompleteHasBeenChecked,
  } = usePcrWorkflowContext();

  const { partners, pcrItem } = useRenamePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { handleSubmit, register, formState, setError, trigger, getFieldState, watch } =
    useForm<RenamePartnerSchemaType>({
      defaultValues: {
        // take the marked as complete state from the current checkbox state on the summary
        markedAsComplete: markedAsCompleteHasBeenChecked,
        accountName: pcrItem.accountName ?? "",
        partnerId: pcrItem.partnerId as string,
        form: FormTypes.PcrRenamePartnerStep,
        pcrItemId: itemId,
        projectId,
        pcrId,
      },
      resolver: zodResolver(getRenamePartnerSchema(partners), {
        errorMap: renamePartnerErrorMap,
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
          <input type="hidden" name="form" value={FormTypes.PcrRenamePartnerStep} />
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="pcrId" value={pcrId} />
          <input type="hidden" name="pcrItemId" value={itemId} />

          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrNameChange.headingSelectPartner)}</Legend>
            <FormGroup hasError={!!getFieldState("partnerId").error}>
              <ValidationError error={getFieldState("partnerId").error} />
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
            <FormGroup hasError={!!getFieldState("accountName").error}>
              <Label bold htmlFor="accountName">
                {getContent(x => x.pcrNameChangeLabels.enterName)}
              </Label>
              <Hint id="hint-for-accountName">{getRequiredToCompleteMessage()}</Hint>
              <ValidationError error={getFieldState("accountName").error} />
              <TextInput
                id="accountName"
                disabled={isFetching}
                {...register("accountName")}
                defaultValue={pcrItem?.accountName ?? ""}
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
