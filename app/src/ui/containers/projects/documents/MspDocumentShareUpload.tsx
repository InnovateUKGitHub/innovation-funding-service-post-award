import { SalesforceAccProjectConnectionDocumentTypeEnum } from "@gql/typegraphql/enum/SalesforceAccProjectConnectionDocumentTypeEnum";
import { Button, createTypedForm, Section } from "@ui/components";
import { useState } from "react";
import { projectDocumentsUploadMutation } from "./ProjectDocumentsUpload.mutation";

const Form = createTypedForm<{
  files: File[];
  projectId: string;
  documentType: SalesforceAccProjectConnectionDocumentTypeEnum;
}>();

const MspDocumentShareUpload = ({ projectId }: { projectId: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<SalesforceAccProjectConnectionDocumentTypeEnum>(
    SalesforceAccProjectConnectionDocumentTypeEnum.AgreementToPCR,
  );
  const validFileTypes = Object.values(SalesforceAccProjectConnectionDocumentTypeEnum).map(x => {
    return {
      id: x,
      value: x,
    };
  });

  return (
    <Section title="Upload">
      <Form.GraphQLForm
        mutation={projectDocumentsUploadMutation}
        data={{
          files,
          projectId,
          documentType: fileType,
        }}
      >
        <Form.Hidden name="projectId" value={() => projectId} />
        <Form.WhatwgMultipleFileUpload name="files" value={() => files} update={(d, a) => setFiles(a ?? [])} />
        <Form.DropdownList
          name="documentType"
          value={() => validFileTypes.find(x => x.id === fileType)}
          update={(_, v) => {
            if (v?.value) setFileType(v.value as SalesforceAccProjectConnectionDocumentTypeEnum);
          }}
          options={validFileTypes}
        ></Form.DropdownList>
        <Button styling="Secondary" onClick={() => setFiles([])}>
          Clear Uploads
        </Button>
        <Form.Button name="upload" styling="Primary">
          Upload Documents
        </Form.Button>
      </Form.GraphQLForm>
    </Section>
  );
};

export { MspDocumentShareUpload };
