import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { Option } from "@framework/dtos/option";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useForm } from "react-hook-form";
import { RoleAndOrganisationSchema, roleAndOrganisationErrorMap, roleAndOrganisationSchema } from "../addPartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useLinks } from "../../utils/useNextLink";
import { PcrPage } from "../../pcrPage";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { pcrProjectRoles } from "@framework/picklist/pcrProjectRoles";
import { pcrPartnerTypes } from "@framework/picklist/pcrPartnerTypes";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { createRegisterButton } from "@framework/util/registerButton";
import { PCROrganisationType, PCRParticipantSize, getPCROrganisationType } from "@framework/constants/pcrConstants";

const setData = (data: RoleAndOrganisationSchema) => {
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
  const { projectId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked, useFormValidate } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { handleSubmit, register, formState, trigger, setValue } = useForm<RoleAndOrganisationSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
    },
    resolver: zodResolver(roleAndOrganisationSchema, {
      errorMap: roleAndOrganisationErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

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
              data: setData(data),
              context: link(data),
            }),
          )}
        >
          <ValidationMessage
            messageType="info"
            message={x => x.pages.pcrAddPartnerRoleAndOrganisation.validationMessage}
          />
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
                    disabled={isFetching}
                    defaultChecked={option.id === roleOptions.selected?.id}
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
                  <Radio key={x.label} {...x} disabled={isFetching} defaultChecked={x.id === "no"} />
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
                    {...option}
                    defaultChecked={option.id === roleOptions.selected?.id}
                    disabled={isFetching}
                  />
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>
          <Fieldset data-qa="save-and-continue">
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              <Content value={x => x.pcrItem.submitButton} />
            </Button>
            <Button type="submit" secondary {...registerButton("saveAndReturn")} disabled={isFetching}>
              <Content value={x => x.pcrItem.returnToSummaryButton} />
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};

const getOptions = <T extends number>(selected: T, options: Option<T>[]) => {
  const filteredOptions = options.filter(x => x.active).map(x => ({ id: x.value.toString(), label: x.label }));

  const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected);

  return { options: filteredOptions, selected: selectedOption };
};
