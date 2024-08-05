import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/context/Mounted";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { PcrPage } from "../../pcrPage";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { getInitialAcademicCosts, useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { AcademicCostsSchema, getAcademicCostsSchema } from "./schemas/academicCosts.zod";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { parseCurrency } from "@framework/util/numberHelper";

type AcademicCostsRhfError = {
  tsbReference: RhfError;
  costs: {
    value: RhfError;
    costCategoryId: RhfError;
  }[];
};

export const AcademicCostsStep = () => {
  const { isClient } = useMounted();
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const link = useLinks();

  const { pcrItem, academicCostCategories, pcrSpendProfile } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);
  const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, academicCostCategories);
  const initialCosts = getInitialAcademicCosts(spendProfile, academicCostCategories);

  const { handleSubmit, register, setError, formState, trigger, setValue, watch } = useForm<AcademicCostsSchema>({
    defaultValues: {
      form: FormTypes.PcrAddPartnerAcademicCostsStep,
      markedAsComplete: String(markedAsCompleteHasBeenChecked),
      button_submit: "submit",
      tsbReference: pcrItem.tsbReference ?? "",
      costs: initialCosts,
    },
    resolver: zodResolver(getAcademicCostsSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors) as AcademicCostsRhfError;
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const total = watch("costs").reduce((acc, cur) => acc + (parseCurrency(cur.value) || 0), 0);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <H2>{getContent(x => x.pcrAddPartnerLabels.projectCostsHeading)}</H2>
        <P>{getContent(x => x.pages.pcrAddPartnerAcademicCosts.stepGuidance)}</P>
        <Form
          data-qa="academic-costs-form"
          onSubmit={handleSubmit(data => {
            return onSave({
              data: {
                tsbReference: data.tsbReference,
                button_submit: data.button_submit,
                type: pcrItem.type,
                spendProfile: {
                  ...spendProfile,
                  costs: data.costs.map(x => ({ ...x, value: parseCurrency(x.value) })) as PcrSpendProfileDto["costs"],
                },
              },
              context: link(data),
            });
          })}
        >
          <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerAcademicCostsStep} />
          <input type="hidden" {...register("markedAsComplete")} value={String(markedAsCompleteHasBeenChecked)} />
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.tsbReferenceHeading)}</Legend>
            <FormGroup hasError={!!validationErrors?.tsbReference}>
              <Label htmlFor="tsb-reference">{getContent(x => x.pages.pcrAddPartnerAcademicCosts.tsbLabel)}</Label>
              <ValidationError error={validationErrors?.tsbReference as RhfError} />
              <TextInput
                hasError={!!validationErrors?.tsbReference}
                id="tsb-reference"
                inputWidth="one-third"
                {...register("tsbReference")}
                disabled={isFetching}
                defaultValue={pcrItem.tsbReference ?? ""}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrAddPartnerAcademicCosts.costsSectionTitle)}</Legend>
            <P>{getContent(x => x.pages.pcrAddPartnerAcademicCosts.costsGuidance)}</P>
          </Fieldset>

          <Table>
            <THead>
              <TR>
                <TH>{getContent(x => x.pages.pcrAddPartnerAcademicCosts.categoryHeading)}</TH>
                <TH className="govuk-table__header--numeric">
                  {getContent(x => x.pages.pcrAddPartnerAcademicCosts.costHeading)}
                </TH>
              </TR>
            </THead>
            <TBody>
              {initialCosts.map((cat, i) => (
                <TR key={cat.description}>
                  <TD>
                    <P>{cat.description}</P>
                    <input type="hidden" name={`costs.${i}.costCategory`} value={cat.costCategory} />
                    <input type="hidden" name={`costs.${i}.costCategoryId`} value={cat.costCategoryId} />
                    <input type="hidden" name={`costs.${i}.id`} value={cat.id} />
                    <input type="hidden" name={`costs.${i}.description`} value={cat.description} />
                  </TD>
                  <TD>
                    <ValidationError error={validationErrors?.costs?.[i]?.value as RhfError} />
                    <NumberInput
                      hasError={!!validationErrors?.costs?.[i]?.value}
                      aria-label={getContent(x =>
                        x.forms.pcr.addPartner.costs.arrayType.value.aria_label({ costCategory: cat.description }),
                      )}
                      disabled={isFetching}
                      {...register(`costs.${i}.value`)}
                      defaultValue={cat.value ?? ""}
                      prefix={getContent(x => x.forms.prefix.gbp)}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
            {isClient && (
              <TFoot>
                <TR>
                  <TD>
                    <P bold className="govuk-body">
                      {getContent(x => x.pages.pcrAddPartnerAcademicCosts.totalCosts)}
                    </P>
                  </TD>
                  <TD className="govuk-table__header--numeric">
                    <P bold>
                      <Currency value={total} />
                    </P>
                  </TD>
                </TR>
              </TFoot>
            )}
          </Table>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
