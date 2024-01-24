import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { parseCurrency } from "@framework/util/numberHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Radio, RadioConditional, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { PcrPage } from "../pcrPage";
import { useNextLink } from "../utils/useNextLink";
import { useApproveNewSubcontractorQuery } from "./ApproveNewSubcontractor.logic";
import {
  ApproveNewSubcontractorSchemaType,
  approveNewSubcontractorErrorMap,
  approveNewSubcontractorSchema,
  subcontractorDescriptionMaxChars,
  subcontractorJustificationMaxChars,
  subcontractorRelationshipJustificationMaxChars,
} from "./ApproveNewSubcontractor.zod";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";

const ApproveNewSubcontractorStep = () => {
  const { projectId, pcrId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked, useFormValidate } =
    usePcrWorkflowContext();
  const nextLink = useNextLink();
  const { getContent } = useContent();

  const { pcrItem } = useApproveNewSubcontractorQuery({ projectId, itemId, fetchKey });

  const { register, handleSubmit, formState, watch, getFieldState, setError, trigger } = useForm<
    z.output<ApproveNewSubcontractorSchemaType>
  >({
    resolver: zodResolver(approveNewSubcontractorSchema, {
      errorMap: approveNewSubcontractorErrorMap,
    }),
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
    },
  });

  const validationErrors = useZodErrors<z.output<ApproveNewSubcontractorSchemaType>>(setError, formState.errors);
  const defaults = useServerInput<z.input<ApproveNewSubcontractorSchemaType>>();
  const subcontractorRelationshipDefault =
    defaults?.subcontractorRelationship ?? pcrItem?.subcontractorRelationship ?? undefined;
  const subcontractorRelationship = watch("subcontractorRelationship") as boolean | string;

  useFormValidate(trigger);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section qa="approve-a-new-subcontractor-step">
        <P>{getContent(x => x.pcrApproveNewSubcontractorLabels.guidance)}</P>
        <Form
          onSubmit={handleSubmit(data => {
            onSave({
              data: {
                ...data,
                subcontractorCost: parseCurrency(data.subcontractorCost),

                // If NO RELATIONSHIP selected, set field to empty string
                subcontractorRelationshipJustification: data.subcontractorRelationship
                  ? data.subcontractorRelationshipJustification
                  : "",
              },
              context: { link: nextLink },
            });
          })}
        >
          <input type="hidden" value={FormTypes.PcrApproveNewSubcontractorStep} {...register("form")} />
          <input type="hidden" value={projectId} {...register("projectId")} />
          <input type="hidden" value={pcrId} {...register("pcrId")} />
          <input type="hidden" value={itemId} {...register("pcrItemId")} />
          <input type="hidden" value={String(markedAsCompleteHasBeenChecked)} {...register("markedAsComplete")} />
          <Fieldset>
            <FormGroup hasError={!!getFieldState("subcontractorName").error}>
              <Label htmlFor="subcontractorName">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorName)}
              </Label>
              <ValidationError error={getFieldState("subcontractorName").error} />
              <TextInput
                id="subcontractorName"
                disabled={isFetching}
                defaultValue={defaults?.subcontractorName ?? pcrItem.subcontractorName ?? undefined}
                {...register("subcontractorName")}
                inputWidth="one-half"
              />
            </FormGroup>
            <FormGroup hasError={!!getFieldState("subcontractorRegistrationNumber").error}>
              <Label htmlFor="subcontractorRegistrationNumber">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRegistrationNumber)}
              </Label>
              <ValidationError error={getFieldState("subcontractorRegistrationNumber").error} />
              <TextInput
                id="subcontractorRegistrationNumber"
                disabled={isFetching}
                defaultValue={
                  defaults?.subcontractorRegistrationNumber ?? pcrItem?.subcontractorRegistrationNumber ?? undefined
                }
                {...register("subcontractorRegistrationNumber")}
                inputWidth="one-third"
              />
            </FormGroup>
            <FormGroup hasError={!!getFieldState("subcontractorRelationship").error}>
              <Label htmlFor="subcontractorRelationship">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationship)}
              </Label>
              <ValidationError error={getFieldState("subcontractorRelationship").error} />
              <RadioList id="subcontractorRelationship" name="subcontractorRelationship" register={register}>
                <Radio
                  id="subcontractorRelationshipYes"
                  value="true"
                  defaultChecked={
                    subcontractorRelationshipDefault === true || subcontractorRelationshipDefault === "true"
                  }
                  disabled={isFetching}
                  label={getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationshipYes)}
                />
                <RadioConditional show={subcontractorRelationship === true || subcontractorRelationship === "true"}>
                  <FormGroup hasError={!!getFieldState("subcontractorRelationshipJustification").error}>
                    <Label htmlFor="subcontractorRelationshipJustification">
                      {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationshipJustification)}
                    </Label>
                    <ValidationError error={getFieldState("subcontractorRelationshipJustification").error} />
                    <TextAreaField
                      id="subcontractorRelationshipJustification"
                      disabled={isFetching}
                      characterCount={watch("subcontractorRelationshipJustification")?.length ?? 0}
                      characterCountMax={subcontractorRelationshipJustificationMaxChars}
                      defaultValue={
                        defaults?.subcontractorRelationshipJustification ??
                        pcrItem?.subcontractorRelationshipJustification ??
                        ""
                      }
                      {...register("subcontractorRelationshipJustification")}
                    />
                  </FormGroup>
                </RadioConditional>
                <Radio
                  id="subcontractorRelationshipNo"
                  value="false"
                  defaultChecked={
                    subcontractorRelationshipDefault === false || subcontractorRelationshipDefault === "false"
                  }
                  disabled={isFetching}
                  label={getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationshipNo)}
                />
              </RadioList>
            </FormGroup>
            <FormGroup hasError={!!getFieldState("subcontractorLocation").error}>
              <Label htmlFor="subcontractorLocation">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorLocation)}
              </Label>
              <ValidationError error={getFieldState("subcontractorLocation").error} />
              <TextInput
                id="subcontractorLocation"
                disabled={isFetching}
                inputWidth="one-third"
                defaultValue={defaults?.subcontractorLocation ?? pcrItem?.subcontractorLocation ?? undefined}
                {...register("subcontractorLocation")}
              />
            </FormGroup>
            <FormGroup hasError={!!getFieldState("subcontractorDescription").error}>
              <Label htmlFor="subcontractorDescription">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorDescription)}
              </Label>
              <ValidationError error={getFieldState("subcontractorDescription").error} />
              <TextAreaField
                id="subcontractorDescription"
                disabled={isFetching}
                characterCount={watch("subcontractorDescription")?.length ?? 0}
                characterCountMax={subcontractorDescriptionMaxChars}
                defaultValue={defaults?.subcontractorDescription ?? pcrItem?.subcontractorDescription ?? undefined}
                {...register("subcontractorDescription")}
              />
            </FormGroup>
            <FormGroup hasError={!!getFieldState("subcontractorCost").error}>
              <Label htmlFor="subcontractorCost">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorCost)}
              </Label>
              <ValidationError error={getFieldState("subcontractorCost").error} />
              <TextInput
                numeric
                prefix="£"
                id="subcontractorCost"
                disabled={isFetching}
                inputWidth="one-quarter"
                defaultValue={defaults?.subcontractorCost ?? pcrItem?.subcontractorCost ?? undefined}
                {...register("subcontractorCost")}
              />
            </FormGroup>
            <FormGroup hasError={!!getFieldState("subcontractorJustification").error}>
              <Label htmlFor="subcontractorJustification">
                {getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorJustification)}
              </Label>
              <ValidationError error={getFieldState("subcontractorJustification").error} />
              <TextAreaField
                id="subcontractorJustification"
                disabled={isFetching}
                characterCount={watch("subcontractorJustification")?.length ?? 0}
                characterCountMax={subcontractorJustificationMaxChars}
                defaultValue={defaults?.subcontractorJustification ?? pcrItem?.subcontractorJustification ?? undefined}
                {...register("subcontractorJustification")}
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

export { ApproveNewSubcontractorStep };
