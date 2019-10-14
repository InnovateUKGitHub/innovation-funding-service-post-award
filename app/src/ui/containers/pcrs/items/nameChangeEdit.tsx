import React from "react";
import * as ACC from "@ui/components";
import { PartnerDto, PCRItemForAccountNameChangeDto, ProjectDto } from "@framework/dtos";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { Pending } from "@shared/pending";
import { DocumentList } from "@ui/components";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";

interface Props {
  project: ProjectDto;
  projectChangeRequestItem: PCRItemForAccountNameChangeDto;
  validator: PCRAccountNameChangeItemDtoValidator;
  status: EditorStatus;
  onChange: (dto: PCRItemForAccountNameChangeDto) => void;
  onSave: () => void;
}

interface InnerProps {
  partners: PartnerDto[];
  documents: DocumentSummaryDto[];
}

const InnerContainer = (props: Props & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForAccountNameChangeDto>();
  const partnerOptions: ACC.SelectOption[] = props.partners.map(x => (
    {
      id: x.id,
      value: x.name
    }
  ));
  const selectedPartnerOption = partnerOptions.find(x => x.id === props.projectChangeRequestItem.partnerId);
  const isCompleteOptions = [{ id: "true", value: "This is ready to submit." }];

  return (
    <ACC.Section>
      <Form.Form
        data={props.projectChangeRequestItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
      >
        <Form.Fieldset heading="Select partner">
          <Form.Radio
            name="partnerSelect"
            options={partnerOptions}
            inline={false}
            value={() => selectedPartnerOption}
            update={(x, value) => x.partnerId = value && value.id}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Enter new name">
          <Form.String
            label="Enter new name"
            labelHidden={true}
            name="enterNewName"
            value={x => x.accountName}
            update={(x, value) => x.accountName = value}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Change of name certificate">
          {props.documents.length > 0 ? <DocumentList documents={props.documents} qa="supporting-documents" /> : <ACC.Renderers.SimpleString>No documents uploaded.</ACC.Renderers.SimpleString>}
          <Form.Button
            name="upload"
            styling="Secondary"
          >
            Upload and remove certificate
          </Form.Button>
        </Form.Fieldset>
        <Form.Fieldset heading="Mark as complete">
          <Form.Checkboxes
            name="itemStatus"
            options={[{ id: "true", value: "This is ready to submit." }]}
            value={x => x.status === ProjectChangeRequestItemStatus.Complete ? isCompleteOptions : []}
            update={(x, value) => x.status = (value && value.some(y => y.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
          />
          <Form.Submit>Save and return to request</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};

export const NameChangeEdit = (props: Props) => (
  <StoresConsumer>
    {
      stores => {
        const combined = Pending.combine({
          partners: stores.partners.getPartnersForProject(props.project.id),
          documents: stores.documents.pcrOrPcrItemDocuments(props.project.id, props.projectChangeRequestItem.id)
        });

        return <ACC.Loader
          pending={combined}
          render={x => <InnerContainer partners={x.partners} documents={x.documents} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
