import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { PcrPage } from "../../pcrPage";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { PCRParticipantSize } from "@framework/constants/pcrConstants";
import { OrganisationDetailsSchema, getOrganisationDetailsSchema } from "./schemas/organisationDetails.zod";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";

export const OrganisationDetailsStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue } = useForm<OrganisationDetailsSchema>({
    defaultValues: {
      button_submit: "submit",
      numberOfEmployees: pcrItem.numberOfEmployees,
      participantSize: pcrItem.participantSize,
    },
    resolver: zodResolver(getOrganisationDetailsSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <H2>{getContent(x => x.pages.pcrAddPartnerOrganisationDetails.sectionTitle)}</H2>
        <Form data-qa="addPartnerForm" onSubmit={handleSubmit(data => onSave({ data, context: link(data) }))}>
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.organisationSizeHeading)}</Legend>
            <FormGroup>
              <Content markdown value={x => x.pages.pcrAddPartnerOrganisationDetails.guidance} />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.participantSize}>
              <ValidationError error={validationErrors?.participantSize as RhfError} />
              <RadioList name="participantSize" register={register}>
                <Radio
                  id="Large"
                  label={getContent(x => x.pcrAddPartnerLabels.organisationSizeLarge)}
                  disabled={isFetching}
                  value={PCRParticipantSize.Large}
                  defaultChecked={pcrItem.participantSize === PCRParticipantSize.Large}
                />
                <Radio
                  id="Medium"
                  label={getContent(x => x.pcrAddPartnerLabels.organisationSizeMedium)}
                  value={PCRParticipantSize.Medium}
                  disabled={isFetching}
                  defaultChecked={pcrItem.participantSize === PCRParticipantSize.Medium}
                />
                <Radio
                  id="Small"
                  label={getContent(x => x.pcrAddPartnerLabels.organisationSizeSmall)}
                  value={PCRParticipantSize.Small}
                  disabled={isFetching}
                  defaultChecked={pcrItem.participantSize === PCRParticipantSize.Small}
                />
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.employeeCountHeading)}</Legend>
            <FormGroup hasError={!!validationErrors?.numberOfEmployees}>
              <ValidationError error={validationErrors?.numberOfEmployees as RhfError} />
              <NumberInput
                hasError={!!validationErrors?.numberOfEmployees}
                inputWidth={4}
                {...register("numberOfEmployees")}
                disabled={isFetching}
                aria-label={getContent(x => x.forms.pcr.addPartner.numberOfEmployees.aria_label)}
              />
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
