import { PCRContactRole } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { useContent } from "@ui/hooks/content.hook";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { FinanceContactSchema, financeContactErrorMap, financeContactSchema } from "../addPartner.zod";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";

export const FinanceContactStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue } = useForm<FinanceContactSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      button_submit: "submit",
      contact1Forename: pcrItem.contact1Forename ?? "",
      contact1Surname: pcrItem.contact1Surname ?? "",
    },
    resolver: zodResolver(financeContactSchema, {
      errorMap: financeContactErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage>
      <Section>
        <H2>{getContent(x => x.pages.pcrAddPartnerProjectContacts.sectionTitle)}</H2>
        <P>{getContent(x => x.pages.pcrAddPartnerProjectContacts.guidance)}</P>
        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data,
              context: link(data),
            }),
          )}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.financeContactHeading)}</Legend>
            <input type="hidden" name="contact1ProjectRole" value={PCRContactRole.FinanceContact} />

            <FormGroup hasError={!!validationErrors?.contact1Forename}>
              <Label htmlFor="contact1Forename">{getContent(x => x.pcrAddPartnerLabels.contactFirstNameHeading)}</Label>
              <ValidationError error={validationErrors?.contact1Forename as RhfErrors} />
              <TextInput
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
            <Button type="submit" secondary disabled={isFetching} {...registerButton("saveAndReturnToSummary")}>
              <Content value={x => x.pcrItem.returnToSummaryButton} />
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
