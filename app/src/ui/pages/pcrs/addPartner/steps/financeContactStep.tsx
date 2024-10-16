import { PCRContactRole } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { useContent } from "@ui/hooks/content.hook";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { FinanceContactSchema, getFinanceContactSchema } from "./schemas/financeContact.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const FinanceContactStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue, watch, setError } = useForm<FinanceContactSchema>({
    defaultValues: {
      form: FormTypes.PcrAddPartnerFinanceContactStep,
      markedAsComplete: String(markedAsCompleteHasBeenChecked),
      button_submit: "submit",
      contact1Forename: pcrItem.contact1Forename ?? "",
      contact1Surname: pcrItem.contact1Surname ?? "",
      contact1Phone: pcrItem.contact1Phone ?? "",
      contact1Email: pcrItem.contact1Email ?? "",
    },
    resolver: zodResolver(getFinanceContactSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <H2>{getContent(x => x.pages.pcrAddPartnerProjectContacts.sectionTitle)}</H2>
        <P>{getContent(x => x.pages.pcrAddPartnerProjectContacts.guidance)}</P>
        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data: { ...data, contact1ProjectRole: PCRContactRole.FinanceContact },
              context: link(data),
            }),
          )}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.financeContactHeading)}</Legend>
            <input type="hidden" name="contact1ProjectRole" value={PCRContactRole.FinanceContact} />
            <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerFinanceContactStep} />
            <input type="hidden" {...register("markedAsComplete")} value={String(markedAsCompleteHasBeenChecked)} />

            <FormGroup hasError={!!validationErrors?.contact1Forename}>
              <Label htmlFor="contact1Forename">{getContent(x => x.pcrAddPartnerLabels.contactFirstNameHeading)}</Label>
              <ValidationError error={validationErrors?.contact1Forename as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact1Forename}
                defaultValue={pcrItem.contact1Forename ?? ""}
                id="contact1Forename"
                disabled={isFetching}
                {...register("contact1Forename")}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.contact1Surname}>
              <Label htmlFor="contact1Surname">{getContent(x => x.pcrAddPartnerLabels.contactLastNameHeading)}</Label>
              <ValidationError error={validationErrors?.contact1Surname as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact1Surname}
                defaultValue={pcrItem.contact1Surname ?? ""}
                id="contact1Surname"
                disabled={isFetching}
                {...register("contact1Surname")}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.contact1Phone}>
              <Label htmlFor="contact1Phone">{getContent(x => x.pcrAddPartnerLabels.contactPhoneNumberHeading)}</Label>
              <Hint id="hint-for-contact1Phone">
                {getContent(x => x.pages.pcrAddPartnerProjectContacts.phoneNumberHint)}
              </Hint>
              <ValidationError error={validationErrors?.contact1Phone as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact1Phone}
                aria-describedby="hint-for-contact1Phone"
                defaultValue={pcrItem.contact1Phone ?? ""}
                id="contact1Phone"
                disabled={isFetching}
                {...register("contact1Phone")}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.contact1Email}>
              <Label htmlFor="contact1Email">{getContent(x => x.pcrAddPartnerLabels.contactEmailHeading)}</Label>
              <ValidationError error={validationErrors?.contact1Email as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact1Email}
                defaultValue={pcrItem.contact1Email ?? ""}
                id="contact1Email"
                {...register("contact1Email")}
                disabled={isFetching}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset data-qa="save-and-continue">
            <Button type="submit" disabled={isFetching} {...registerButton("submit")}>
              <Content value={x => x.pcrItem.submitButton} />
            </Button>
            <Button type="submit" secondary disabled={isFetching} {...registerButton("returnToSummary")}>
              <Content value={x => x.pcrItem.saveAndReturnToSummaryButton} />
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
