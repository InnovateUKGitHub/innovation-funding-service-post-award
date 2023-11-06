import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { getPartnerName } from "@ui/components/atomicDesign/organisms/partners/utils/partnerName";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useRenamePartnerWorkflowQuery } from "./renamePartner.logic";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNextLink } from "../utils/useNextLink";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { getRenamePartnerSchema, errorMap, RenamePartnerSchemaType } from "./renamePartner.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export const RenamePartnerStep = () => {
  const { getContent } = useContent();
  const {
    projectId,
    itemId,
    fetchKey,
    getRequiredToCompleteMessage,
    onSave,
    isFetching,
    markedAsCompleteHasBeenChecked,
    useFormValidate,
  } = usePcrWorkflowContext();

  const { partners, pcrItem } = useRenamePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { handleSubmit, register, formState, trigger } = useForm<RenamePartnerSchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete || markedAsCompleteHasBeenChecked,
      accountName: pcrItem.accountName ?? "",
      partnerId: pcrItem.partnerId as string,
    },
    resolver: zodResolver(getRenamePartnerSchema(partners), {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const partnerOptions = partners
    .filter(x => !x.isWithdrawn)
    .map(x => ({
      id: x.id,
      label: getPartnerName(x),
    }));

  const nextLink = useNextLink();
  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <Form
          onSubmit={handleSubmit(data => {
            onSave({ data, context: { link: nextLink } });
          })}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrNameChange.headingSelectPartner)}</Legend>
            <FormGroup>
              <RadioList name="partnerId" register={register}>
                {partnerOptions.map(partner => (
                  <Radio key={partner.id} id={partner.id} label={partner.label} disabled={isFetching}></Radio>
                ))}
              </RadioList>
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Legend>{getContent(x => x.pcrNameChangeLabels.enterName)}</Legend>
            <FormGroup>
              <Hint id="hint-for-accountName">{getRequiredToCompleteMessage()}</Hint>
              <TextInput disabled={isFetching} {...register("accountName")} />
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
