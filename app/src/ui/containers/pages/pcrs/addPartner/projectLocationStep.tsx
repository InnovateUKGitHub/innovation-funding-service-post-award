import { PCRProjectLocation } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useLinks } from "../utils/useNextLink";
import { useAddPartnerWorkflowQuery } from "./addPartner.logic";
import { PcrPage } from "../pcrPage";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { ProjectLocationSchema, projectLocationErrorMap, projectLocationSchema } from "./addPartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";

const pcrProjectLocation = [
  {
    active: true,
    value: PCRProjectLocation.InsideTheUnitedKingdom,
    label: "Inside the United Kingdom",
  },
  {
    active: true,
    value: PCRProjectLocation.OutsideTheUnitedKingdom,
    label: "Outside the United Kingdom",
  },
];

export const ProjectLocationStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue } = useForm<ProjectLocationSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      button_submit: "submit",
      projectLocation: pcrItem.projectLocation.toString(),
      projectPostcode: pcrItem.projectPostcode ?? "",
      projectCity: pcrItem.projectCity ?? "",
    },
    resolver: zodResolver(projectLocationSchema, {
      errorMap: projectLocationErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <H2>{getContent(x => x.pcrAddPartnerLabels.projectLocationHeading)}</H2>

        <Form
          onSubmit={handleSubmit(data =>
            onSave({
              data: {
                ...data,
                projectLocation: parseInt(data.projectLocation, 10),
              },
              context: link(data),
            }),
          )}
        >
          <Fieldset>
            <FormGroup>
              <Hint id="hint-for-project-location">
                {getContent(x => x.pages.pcrAddPartnerProjectLocation.projectLocationGuidance)}
              </Hint>
              <RadioList
                aria-describedby="hint-for-project-location"
                id="project-location"
                name="projectLocation"
                register={register}
              >
                {pcrProjectLocation.map(option => (
                  <Radio
                    key={option.value.toString()}
                    id={option.label}
                    defaultChecked={option.value === pcrItem.projectLocation}
                    value={option.value.toString()}
                    label={option.label}
                    disabled={isFetching}
                  />
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <FormGroup>
              <Label bold htmlFor="project-city">
                {getContent(x => x.pcrAddPartnerLabels.townOrCityHeading)}
              </Label>
              <TextInput id="project-city" {...register("projectCity")} disabled={isFetching} />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <FormGroup>
              <Label bold htmlFor="project-postcode">
                {getContent(x => x.pcrAddPartnerLabels.postcodeHeading)}
              </Label>
              <Hint id="hint-for-project-postcode">
                {getContent(x => x.pages.pcrAddPartnerProjectLocation.postcodeGuidance)}
              </Hint>
              <TextInput id="project-postcode" {...register("projectPostcode")} disabled={isFetching} />
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
