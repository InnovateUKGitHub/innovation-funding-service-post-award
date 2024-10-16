import { Section } from "@ui/components/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { PCRContactRole } from "@framework/constants/pcrConstants";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { useMounted } from "@ui/context/Mounted";
import { ProjectManagerSchema, getProjectManagerSchema } from "./schemas/projectManager.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const ProjectManagerDetailsStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue, reset, watch, setError } =
    useForm<ProjectManagerSchema>({
      defaultValues: {
        button_submit: "submit",
        contact2Forename: pcrItem.contact2Forename ?? "",
        contact2Surname: pcrItem.contact2Surname ?? "",
        contact2Phone: pcrItem.contact2Phone ?? "",
        contact2Email: pcrItem.contact2Email ?? "",
        form: FormTypes.PcrAddPartnerProjectManagerStep,
        markedAsComplete: String(markedAsCompleteHasBeenChecked),
      },
      resolver: zodResolver(getProjectManagerSchema(markedAsCompleteHasBeenChecked), {
        errorMap: addPartnerErrorMap,
      }),
    });

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const { isClient } = useMounted();

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <H2>{getContent(x => x.pages.pcrAddPartnerProjectContacts.sectionTitle)}</H2>
        <P>{getContent(x => x.pages.pcrAddPartnerProjectContacts.guidance)}</P>
        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data: { ...data, contact2ProjectRole: PCRContactRole.ProjectManager },
              context: link(data),
            }),
          )}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.projectLeadContactHeading)}</Legend>
            <input type="hidden" name="contact2ProjectRole" value={PCRContactRole.ProjectManager} />
            <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerProjectManagerStep} />
            <input type="hidden" {...register("markedAsComplete")} value={String(markedAsCompleteHasBeenChecked)} />

            {isClient && (
              <Button
                type="button"
                secondary
                name="useFinanceContactDetails"
                onClick={() =>
                  reset({
                    button_submit: "submit",
                    contact2Forename: pcrItem.contact1Forename ?? "",
                    contact2Surname: pcrItem.contact1Surname ?? "",
                    contact2Phone: pcrItem.contact1Phone ?? "",
                    contact2Email: pcrItem.contact1Email ?? "",
                  })
                }
              >
                {getContent(x => x.pages.pcrAddPartnerProjectContacts.useFinanceDetails)}
              </Button>
            )}

            <FormGroup hasError={!!validationErrors?.contact2Forename}>
              <Label htmlFor="contact2Forename">{getContent(x => x.pcrAddPartnerLabels.contactFirstNameHeading)}</Label>
              <ValidationError error={validationErrors?.contact2Forename as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact2Forename}
                defaultValue={pcrItem.contact2Forename ?? ""}
                id="contact2Forename"
                disabled={isFetching}
                {...register("contact2Forename")}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.contact2Surname}>
              <Label htmlFor="contact2Surname">{getContent(x => x.pcrAddPartnerLabels.contactLastNameHeading)}</Label>
              <ValidationError error={validationErrors?.contact2Surname as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact2Surname}
                defaultValue={pcrItem.contact2Surname ?? ""}
                id="contact2Surname"
                disabled={isFetching}
                {...register("contact2Surname")}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.contact2Phone}>
              <Label htmlFor="contact2Phone">{getContent(x => x.pcrAddPartnerLabels.contactPhoneNumberHeading)}</Label>
              <Hint id="hint-for-contact2Phone">
                {getContent(x => x.pages.pcrAddPartnerProjectContacts.phoneNumberHint)}
              </Hint>
              <ValidationError error={validationErrors?.contact2Phone as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact2Phone}
                aria-describedby="hint-for-contact2Phone"
                defaultValue={pcrItem.contact2Phone ?? ""}
                id="contact2Phone"
                disabled={isFetching}
                {...register("contact2Phone")}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.contact2Email}>
              <Label htmlFor="contact2Email">{getContent(x => x.pcrAddPartnerLabels.contactEmailHeading)}</Label>
              <ValidationError error={validationErrors?.contact2Email as RhfErrors} />
              <TextInput
                hasError={!!validationErrors?.contact2Email}
                defaultValue={pcrItem.contact2Email ?? ""}
                id="contact2Email"
                {...register("contact2Email")}
                disabled={isFetching}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset data-qa="save-and-continue">
            <Button type="submit" disabled={isFetching} {...registerButton("submit")}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>
            <Button type="submit" secondary disabled={isFetching} {...registerButton("returnToSummary")}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
