import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { PcrPage } from "../../pcrPage";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { AcademicCostsSchema, addPartnerErrorMap, academicCostsSchema } from "../addPartner.zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";

export const AcademicCostsStep = () => {
  const { isClient } = useMounted();
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const link = useLinks();

  const { pcrItem, academicCostCategories, pcrSpendProfile } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, academicCostCategories);

  const { handleSubmit, register, formState, trigger, setValue, watch } = useForm<AcademicCostsSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      button_submit: "submit",
      tsbReference: pcrItem.tsbReference ?? "",
      costs: spendProfile.costs.map(x => ({
        value: x.value ?? 0,
      })),
    },
    resolver: zodResolver(academicCostsSchema, {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const total = watch("costs").reduce((acc, cur) => acc + Number(cur.value), 0);

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
                ...data,
                spendProfile: {
                  ...spendProfile,
                  costs: spendProfile.costs.map((x, i) => ({ ...x, value: Number(data.costs[i].value ?? 0) })),
                },
              },
              context: link(data),
            });
          })}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.tsbReferenceHeading)}</Legend>
            <FormGroup>
              <Label htmlFor="tsb-reference">{getContent(x => x.pages.pcrAddPartnerAcademicCosts.tsbLabel)}</Label>
              <ValidationError error={validationErrors?.tsbReference as RhfError} />
              <TextInput
                id="tsb-reference"
                inputWidth="one-third"
                {...register("tsbReference")}
                disabled={isFetching}
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
              {academicCostCategories.map((x, i) => (
                <TR key={x.name}>
                  <TD>
                    <P>{x.name}</P>
                  </TD>
                  <TD>
                    <NumberInput
                      aria-label={`value of academic cost item ${x.name}`}
                      disabled={isFetching}
                      {...register(`costs.${i}.value`)}
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
              {getContent(x => x.pcrItem.returnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
