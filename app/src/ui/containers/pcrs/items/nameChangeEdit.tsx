import React from "react";
import * as ACC from "@ui/components";
import { PartnerDto, PCRDto, PCRItemForAccountNameChangeDto, ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { DocumentList } from "@ui/components";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { IRoutes } from "@ui/routing";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";

interface Props {
  project: ProjectDto;
  projectChangeRequest: PCRDto;
  projectChangeRequestItem: PCRItemForAccountNameChangeDto;
  validator: PCRAccountNameChangeItemDtoValidator;
  status: EditorStatus;
  routes: IRoutes;
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
  const isCompleteOptions = [{ id: "true", value: "I have finished making changes." }];

  return (
    <ACC.Section>
      <Form.Form
        qa="changePartnerNameForm"
        data={props.projectChangeRequestItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
      >
        <Form.Fieldset heading="Select partner">
          <Form.Radio
            name="partnerId"
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
            name="accountName"
            value={x => x.accountName}
            update={(x, value) => x.accountName = value}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Change of name certificate">
          {props.documents.length > 0 ? <DocumentList documents={props.documents} qa="supporting-documents" /> : <ACC.ValidationMessage message="No documents uploaded." messageType="info" />}
          <ACC.Link
            styling="SecondaryButton"
            route={props.routes.pcrPrepareFiles.getLink({projectId: props.project.id, pcrId: props.projectChangeRequest.id, itemId: props.projectChangeRequestItem.id})}
          >
            Upload and remove certificate
          </ACC.Link>
        </Form.Fieldset>
        <Form.Fieldset heading="Mark as complete">
          <Form.Checkboxes
            name="itemStatus"
            options={[{ id: "true", value: "I have finished making changes." }]}
            value={x => x.status === PCRItemStatus.Complete ? isCompleteOptions : []}
            update={(x, value) => x.status = (value && value.some(y => y.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
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
