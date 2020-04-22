import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

const Component = (props: ContainerProps & PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  // const labourCostCategory = props.costCategories.find(x => x.type === CostCategoryType.Labour)!;
  return (
    <ACC.Section title="Project costs for new partner">
      {/*<ACC.Link route={props.routes.pcrPrepareSpendProfileCosts.getLink({itemId: props.pcrItem.id, pcrId: props.pcr.id, projectId: props.project.id, costCategoryId: labourCostCategory.id})}>{labourCostCategory.name}</ACC.Link>*/}
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>Save and continue</Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>Save and return to summary</Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};

export const SpendProfileStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.costCategories.getAll()} // TODO filter these by project and partner type
          render={x => <Component costCategories={x} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
