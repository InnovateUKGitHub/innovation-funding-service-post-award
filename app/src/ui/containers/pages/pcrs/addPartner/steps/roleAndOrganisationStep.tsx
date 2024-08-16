import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { Info } from "@ui/components/atoms/Details/Details";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useForm } from "react-hook-form";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinks } from "../../utils/useNextLink";
import { PcrPage } from "../../pcrPage";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { pcrProjectRoles } from "@framework/picklist/pcrProjectRoles";
import { pcrPartnerTypes } from "@framework/picklist/pcrPartnerTypes";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { createRegisterButton } from "@framework/util/registerButton";
import {
  PCROrganisationType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectRole,
  getPCROrganisationType,
} from "@framework/constants/pcrConstants";
import { RoleAndOrganisationSchema, roleAndOrganisationSchema } from "./schemas/roleAndOrganisation.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const setData = (data: RoleAndOrganisationSchema) => {
  // It's not possible to come back to this page after it's submitted
  // so we can assume that the participant size hasn't explicitly been set by the user yet
  // and it's safe for us to reset it
  let participantSize = PCRParticipantSize.Unknown;

  // If the partner type is academic then the organisation step is skipped and the participant size is set to "Academic"
  const organisationType = getPCROrganisationType(data.partnerType);
  if (organisationType === PCROrganisationType.Academic) {
    participantSize = PCRParticipantSize.Academic;
  }

  return {
    ...data,
    organisationType,
    participantSize,
    isCommercialWork: data.isCommercialWork === "true",
  };
};

export const RoleAndOrganisationStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, onSave, isFetching, refreshItemWorkflowQuery, markedAsCompleteHasBeenChecked } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const formHasBeenFilled =
    pcrItem.projectRole !== PCRProjectRole.Unknown && pcrItem.partnerType !== PCRPartnerType.Unknown;

  const { handleSubmit, register, formState, trigger, setValue, watch, setError } = useForm<RoleAndOrganisationSchema>({
    defaultValues: {
      form: FormTypes.PcrAddPartnerRoleAndOrganisationStep,
      isCommercialWork: pcrItem.isCommercialWork === null ? undefined : pcrItem.isCommercialWork ? "true" : "false",
      projectRole: pcrItem.projectRole,
      partnerType: pcrItem.partnerType,
    },
    resolver: zodResolver(roleAndOrganisationSchema, {
      errorMap: addPartnerErrorMap,
    }),
  });

  const disabled = formHasBeenFilled || isFetching;

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const link = useLinks();
  const roleOptions = getOptions(pcrItem.projectRole, pcrProjectRoles);

  const typeOptions = getOptions(pcrItem.partnerType, pcrPartnerTypes);

  const commercialWorkOptions = [
    {
      value: "true",
      id: "yes",
      label: getContent(x => x.pcrAddPartnerLabels.commercialWorkYes),
    },
    {
      value: "false",
      id: "no",
      label: getContent(x => x.pcrAddPartnerLabels.commercialWorkNo),
    },
  ];

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section qa="role-and-partner-type" title={x => x.pages.pcrAddPartnerRoleAndOrganisation.formSectionTitle}>
        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data: formHasBeenFilled ? {} : setData(data),
              context: link(data),
            }).then(() => refreshItemWorkflowQuery()),
          )}
        >
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerRoleAndOrganisationStep} />

          {formHasBeenFilled ? (
            <ValidationMessage
              messageType="info"
              message={x => x.pages.pcrAddPartnerRoleAndOrganisation.alreadyCompletedMessage}
            />
          ) : (
            <ValidationMessage
              messageType="info"
              message={x => x.pages.pcrAddPartnerRoleAndOrganisation.validationMessage}
            />
          )}

          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.roleHeading)}</Legend>

            <FormGroup hasError={!!validationErrors?.projectRole}>
              <ValidationError error={validationErrors?.projectRole as RhfError} />
              <RadioList name="projectRole" id="questions" register={register}>
                {roleOptions.options.map(option => (
                  <Radio
                    key={option.id}
                    id={option.id}
                    data-qa={option.label}
                    label={option.label}
                    value={option.value}
                    defaultChecked={option.id === roleOptions.selected?.id}
                    disabled={isFetching}
                  />
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.commercialWorkHeading)}</Legend>

            <FormGroup hasError={!!validationErrors?.isCommercialWork}>
              <Label htmlFor="isCommercialWork">{getContent(x => x.pcrAddPartnerLabels.commercialWorkLabel)}</Label>
              <Hint id="hint-for-isCommercialWork">
                {getContent(x => x.pcrAddPartnerLabels.commercialWorkLabelHint)}
              </Hint>
              <ValidationError error={validationErrors?.isCommercialWork as RhfError} />
              <RadioList id="isCommercialWork" name="isCommercialWork" register={register}>
                {commercialWorkOptions.map(x => (
                  <Radio
                    key={x.label}
                    {...x}
                    defaultChecked={x.id === (pcrItem.isCommercialWork ? "yes" : "no")}
                    disabled={isFetching}
                  />
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.organisationHeading)}</Legend>
            <Info summary={<Content value={x => x.pages.pcrAddPartnerRoleAndOrganisation.infoSummary} />}>
              <Content markdown value={x => x.pages.pcrAddPartnerRoleAndOrganisation.organisationTypeInfo} />
            </Info>
            <FormGroup hasError={!!validationErrors?.partnerType}>
              <Hint id="hint-for-partner-type">
                {getContent(x => x.pages.pcrAddPartnerRoleAndOrganisation.organisationTypeHint)}
              </Hint>
              <ValidationError error={validationErrors?.partnerType as RhfError} />
              <RadioList id="partner-type" name="partnerType" register={register}>
                {typeOptions.options.map(option => (
                  <Radio
                    key={option.label}
                    label={option.label}
                    value={option.value}
                    id={option.id}
                    defaultChecked={option.id === typeOptions.selected?.id}
                    disabled={isFetching}
                  />
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>
          <Fieldset data-qa="save-and-continue">
            <Button type="submit" {...registerButton("submit")} disabled={disabled}>
              <Content value={x => x.pcrItem.submitButton} />
            </Button>
            <Button type="submit" secondary {...registerButton("saveAndReturn")} disabled={disabled}>
              <Content value={x => x.pcrItem.saveAndReturnToSummaryButton} />
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};

const getOptions = <T extends number>(
  selected: T,
  options: readonly { id: string; label: string; active: boolean; value: string | number }[],
) => {
  const filteredOptions = options.filter(x => x.active);

  const selectedOption = selected && filteredOptions.find(x => Number(x.value) === selected);

  return { options: filteredOptions, selected: selectedOption };
};
