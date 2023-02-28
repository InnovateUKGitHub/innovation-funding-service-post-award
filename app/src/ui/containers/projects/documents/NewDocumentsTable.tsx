import { getDefinedEdges } from "@gql/selectors/edges";
import { TypedTable } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { useFragment } from "react-relay";
import { newDocumentsTableFragment } from "./NewDocumentsTable.fragment";
import {
  NewDocumentsTableFragment$data,
  NewDocumentsTableFragment$key,
} from "./__generated__/NewDocumentsTableFragment.graphql";

const DocumentTable = TypedTable<{ node: NonNullable<GQL.NodeValue<NewDocumentsTableFragment$data>> }>();

const NewDocumentsTable = ({ documents }: { documents: NewDocumentsTableFragment$key | null }) => {
  if (!documents) return null;

  const data = useFragment(newDocumentsTableFragment, documents);

  return (
    <DocumentTable.Table qa="neue-document-table" data={getDefinedEdges(data.edges)}>
      <DocumentTable.String
        qa="neue-document-table-title"
        value={x => x.node.ContentDocument?.Title?.value ?? "Untitled File"}
      />
      <DocumentTable.String
        qa="neue-document-table-title"
        value={x => x.node.ContentDocument?.FileType?.value ?? ""}
      />
      <DocumentTable.Custom
        qa="neue-document-table-delete"
        value={x => <SimpleString>so called "delete" button</SimpleString>}
      />
    </DocumentTable.Table>
  );
};

export { NewDocumentsTable }
