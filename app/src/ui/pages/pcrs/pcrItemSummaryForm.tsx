import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Checkbox, CheckboxList } from "@ui/components/atoms/form/Checkbox/Checkbox";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { useContent } from "@ui/hooks/content.hook";
import { UseFormHandleSubmit, UseFormRegister, UseFormWatch } from "react-hook-form";
import { usePcrWorkflowContext } from "./pcrItemWorkflow";
import { ReactNode, useEffect } from "react";

export const PcrItemSummaryForm = <FormValues extends { markedAsComplete: boolean }>({
  register,
  pcrItem,
  handleSubmit,
  watch,
  children,
}: {
  pcrItem: Pick<FullPCRItemDto, "type" | "status">;
  register: UseFormRegister<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  watch: UseFormWatch<FormValues>;
  children?: ReactNode;
}) => {
  const { itemId, routes, projectId, pcrId, isFetching, onSave, allowSubmit, setMarkedAsCompleteHasBeenChecked } =
    usePcrWorkflowContext();
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);

  const { getContent } = useContent();

  const canReallocatePcr = pcrItem.type === PCRItemType.MultiplePartnerFinancialVirement;

  const watchedCheckbox = watch().markedAsComplete;

  useEffect(() => {
    setMarkedAsCompleteHasBeenChecked(watchedCheckbox);
  }, [watchedCheckbox]);

  return (
    <Form
      onSubmit={handleSubmit((data: FormValues) => {
        return onSave({
          data: {
            status: data.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
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
      {children}

      {canReallocatePcr && (
        <Fieldset>
          <Hint id="hint-for-grantMovingOverFinancialYear">
            {getContent(x => x.pages.pcrWorkflowSummary.reallocateGrantHint)}
          </Hint>
          <NumberInput
            id="grantMovingOverFinancialYear"
            name="grantMovingOverFinancialYear"
            width={10}
            prefix={getContent(x => x.forms.prefix.gbp)}
          />
        </Fieldset>
      )}

      <Fieldset>
        <Legend>{getContent(x => x.pages.pcrWorkflowSummary.markAsCompleteLabel)}</Legend>
        <FormGroup>
          <CheckboxList name="markedAsComplete" register={register} disabled={isFetching}>
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
