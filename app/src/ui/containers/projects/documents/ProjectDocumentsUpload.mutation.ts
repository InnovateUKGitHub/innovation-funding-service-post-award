import { graphql } from "relay-runtime";

const projectDocumentsUploadMutation = graphql`
  mutation ProjectDocumentsUploadMutation(
    $files: [File!]!
    $projectId: ID!
    $partnerId: ID
    $documentType: SalesforceAccProjectConnectionDocumentTypeEnum!
  ) {
    mspDocumentShareUpload(files: $files, projectId: $projectId, partnerId: $partnerId, type: $documentType)
  }
`;

export { projectDocumentsUploadMutation };
