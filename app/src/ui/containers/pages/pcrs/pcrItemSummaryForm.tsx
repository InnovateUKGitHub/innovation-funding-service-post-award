import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { useContent } from "@ui/hooks/content.hook";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";

export const PcrItemSummaryForm = <FormValues extends { itemStatus: "marked-as-complete" | string }>({
  register,
  pcrItem,
  handleSubmit,
}: {
  pcrItem: Pick<FullPCRItemDto, "type" | "status">;
  register: UseFormRegister<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
}) => {
  const { itemId, routes, projectId, pcrId, isFetching, onSave, allowSubmit } = usePcrWorkflowContext();
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);

  const { getContent } = useContent();

  const canReallocatePcr = pcrItem.type === PCRItemType.MultiplePartnerFinancialVirement;

  return (
    <Form
      onSubmit={handleSubmit((data: FormValues) => {
        return onSave({
          data: {
            status: data.itemStatus === "marked-as-complete" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
          },
          context: {
            link: routes.pcrPrepare.getLink({
              projectId,
              pcrId,
            }),
          },
        });
      })}
    >
      {canReallocatePcr && (
        <Fieldset>
          <Hint id="hint-for-grantMovingOverFinancialYear">
            {getContent(x => x.pages.pcrWorkflowSummary.reallocateGrantHint)}
          </Hint>
          <NumberInput id="grantMovingOverFinancialYear" name="grantMovingOverFinancialYear" width={10} />
        </Fieldset>
      )}

      <Fieldset>
        <Legend>{getContent(x => x.pages.pcrWorkflowSummary.markAsCompleteLabel)}</Legend>
        <FormGroup>
          <CheckboxList name="itemStatus" register={register} disabled={isFetching}>
            <Checkbox
              defaultChecked={pcrItem.status === PCRItemStatus.Complete}
              id="marked-as-complete"
              label={getContent(x => x.pages.pcrWorkflowSummary.agreeToChangeLabel)}
            />
          </CheckboxList>
        </FormGroup>

        {allowSubmit && (
          <FormGroup>
            <Button type="submit" disabled={isFetching}>
              {getContent(x => x.pages.pcrWorkflowSummary.buttonSaveAndReturn)}
            </Button>
          </FormGroup>
        )}
      </Fieldset>
    </Form>
  );
};
