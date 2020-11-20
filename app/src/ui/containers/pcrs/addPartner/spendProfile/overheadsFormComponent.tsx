import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { Option, PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRSpendProfileCostDto, PCRSpendProfileOverheadsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROverheadsCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { SpendProfileCostFormProps } from "@ui/containers";
import { PCRItemType, PCRSpendProfileOverheadRate } from "@framework/types";
import { roundCurrency } from "@framework/util";
import { CostCategoryType } from "@framework/entities";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { ValidationMessage } from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDtoValidator } from "@ui/validators";

interface InnerProps {
  rateOptions: Option<PCRSpendProfileOverheadRate>[];
  documents: DocumentSummaryDto[];
}

class Component extends React.Component<SpendProfileCostFormProps<PCRSpendProfileOverheadsCostDto, PCROverheadsCostDtoValidator> & InnerProps> {
  render() {
    const { editor, validator, data, documents } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileOverheadsCostDto>();
    const rateOptions = this.getOptions(this.props.data.overheadRate, this.props.rateOptions);

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={dto => this.onChange(dto)}
      >
        <Form.Fieldset qa="overheads-costs">
          <Form.Hidden
            name="id"
            value={dto => dto.id}
          />
          <Form.Radio
              name="overheadRate"
              options={rateOptions.options}
              inline={false}
              value={() => rateOptions.selected}
              update={(x, option) => {
                if (!option) {
                  return x.overheadRate = PCRSpendProfileOverheadRate.Unknown;
                }
                x.overheadRate = parseInt(option.id, 10);
                // As we need to save the cost before moving to document upload page if overhead rate is calculated,
                // value is set to 0 here to prevent validation errors.
                if (x.overheadRate === PCRSpendProfileOverheadRate.Calculated && x.value === null) {
                  x.value = 0;
                }
              }}
              validation={validator.overheadRate}
          />
          {this.renderFormHiddenSection(data, Form, validator, documents, editor)}
          {this.props.isClient && <Form.Custom
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.overheads.totalCost}
            labelBold={true}
            name="totalCost"
            value={dto => <ACC.Renderers.SimpleString><ACC.Renderers.Currency value={dto.value}/></ACC.Renderers.SimpleString>}
            update={() => null}
          />}
        </Form.Fieldset>
        <Form.Fieldset qa="save">
          <Form.Submit><ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.overheads.submitButton()}/></Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private getOptions<T extends number>(selected: T, options: Option<T>[]) {
    const filteredOptions: ACC.SelectOption[] = options
      .filter(x => x.active)
      .map(x => ({ id: x.value.toString(), value: x.label }));

    const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected);

    return {options: filteredOptions, selected: selectedOption};
  }

  private renderFormHiddenSection(data: PCRSpendProfileOverheadsCostDto, form: ACC.FormBuilder<PCRSpendProfileOverheadsCostDto>, validator: PCROverheadsCostDtoValidator, documents: DocumentSummaryDto[], editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    // If server rendering then always show hidden section
    if (this.props.isClient && data.overheadRate !== PCRSpendProfileOverheadRate.Calculated) return null;
    return (
      <form.Fieldset>
        <ACC.Renderers.SimpleString><ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.messages.overHeadsCalculatedGuidance} /></ACC.Renderers.SimpleString>
        <form.Button name="calculateOverheadsDocuments" onClick={() => this.props.onSave(editor.data, this.getUploadDocumentsLink())}><ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.labels.overheads.uploadDocumentsLink} /></form.Button>
        {this.renderDocuments(documents)}
        <form.Numeric
          labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.overheads.calculatedCost}
          width="one-quarter"
          name="value"
          value={dto => dto.value}
          update={(dto, val) => dto.value = val}
          validation={validator && validator.value}
        />
      </form.Fieldset>
    );
  }

  private getOverheadsCostValue(overheadsCostDto: PCRSpendProfileOverheadsCostDto, costs: PCRSpendProfileCostDto[]) {
    switch (overheadsCostDto.overheadRate) {
      case PCRSpendProfileOverheadRate.Unknown:
        return null;
      case PCRSpendProfileOverheadRate.Calculated:
        return overheadsCostDto.value;
      case PCRSpendProfileOverheadRate.Zero:
        return 0;
      case PCRSpendProfileOverheadRate.Twenty:
        const labourCosts = costs
          .filter(x => x.costCategory === CostCategoryType.Labour)
          .reduce((acc, item) => acc + (item.value || 0), 0);
        return roundCurrency(labourCosts * 20 / 100);
      default:
        return null;
    }
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return (
      <ACC.Section titleContent={x => x.pcrSpendProfilePrepareCostContent.documentLabels.filesUploadedTitle} qa="supporting-documents-section">
        <ACC.Renderers.SimpleString>{documents.length ? <ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.documentLabels.filesUploadedSubtitle}/> : "" }</ACC.Renderers.SimpleString>
        {documents.length > 0 ? <ACC.DocumentTable documents={documents} qa="supporting-documents"/> : <ValidationMessage message={x => x.pcrSpendProfilePrepareCostContent.documentMessages.noDocumentsUploaded} messageType="info" />}
      </ACC.Section>
    );
  }

  private onChange(dto: PCRSpendProfileOverheadsCostDto) {
    const pcrItem = this.props.editor.data.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    const value = this.getOverheadsCostValue(dto, pcrItem.spendProfile.costs);
    dto.value = value;
    this.props.onChange(this.props.editor.data);
  }

  private getUploadDocumentsLink() {
    const { params } = this.props;
    return this.props.routes.pcrSpendProfileOverheadDocument.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId
    });
  }
}

export const OverheadsFormComponent = (props: SpendProfileCostFormProps<PCRSpendProfileOverheadsCostDto, PCROverheadsCostDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        const rateOptions = stores.projectChangeRequests.getPcrSpendProfileOverheadRateOptions();
        const documents = stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.params.projectId, props.params.itemId);
        return <ACC.Loader
          pending={Pending.combine({rateOptions, documents})}
          render={x => <Component rateOptions={x.rateOptions} documents={x.documents} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
