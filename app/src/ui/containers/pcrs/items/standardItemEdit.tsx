import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { IRoutes } from "@ui/routing";
import { PCRItemStatus } from "@framework/constants";

interface Props {
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRStandardItemDto;
  validator: PCRStandardItemDtoValidator;
  status: EditorStatus;
  routes: IRoutes;
  onChange: (dto: Dtos.PCRStandardItemDto) => void;
  onSave: () => void;
}

interface InnerProps {
  documents: DocumentSummaryDto[];
}

const InnerStandardItemEdit = (props: Props & InnerProps) => {
  const Form = ACC.TypedForm<Dtos.PCRStandardItemDto>();

  const options: ACC.SelectOption[] = [
    { id: "true", value: "I have finished making changes." }
  ];

  return (
    <React.Fragment>
      <ACC.Section title="Files uploaded">
        {
          props.documents.length > 0 ?
            <ACC.DocumentList documents={props.documents} qa="supporting-documents" /> :
            <ACC.ValidationMessage messageType="info" message="No files uploaded" />
        }
        <ACC.Link styling="SecondaryButton" route={props.routes.pcrPrepareFiles.getLink({projectId: props.projectChangeRequest.projectId, pcrId: props.projectChangeRequest.id, itemId: props.projectChangeRequestItem.id})}>Upload and remove documents</ACC.Link>
      </ACC.Section>

      <ACC.Section>
        <Form.Form
          data={props.projectChangeRequestItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave()}
          qa="itemStatus"
        >
          <Form.Fieldset heading="Mark as complete">
            <Form.Checkboxes
              name="itemStatus"
              options={options}
              value={m => m.status === PCRItemStatus.Complete ? [options[0]] : []}
              update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
              validation={props.validator.status}
            />
            <Form.Submit>Save and return to request</Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>

    </React.Fragment>
  );
};

export const StandardItemEdit = (props: Props) => (
  <StoresConsumer>
    {stores => {
      const projectId = props.projectChangeRequest.projectId;
      const itemId = props.projectChangeRequestItem.id;
      const pendingDocuments = stores.documents.pcrOrPcrItemDocuments(projectId, itemId);

      return (
        <ACC.Loader
          pending={pendingDocuments}
          render={(documents) => (
            <InnerStandardItemEdit
              documents={documents}
              {...props}
            />
          )}
        />
      );
    }
    }
  </StoresConsumer>
);
