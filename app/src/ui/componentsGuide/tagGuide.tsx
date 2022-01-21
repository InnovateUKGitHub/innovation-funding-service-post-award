import { IGuide } from "@framework/types";
import { TypedTable } from "@ui/components/table";
import { Tag, TagTypeOptions } from "@ui/components/Tag";

export const tagGuide: IGuide = {
  name: "Tag",
  options: [
    {
      name: "Variants",
      comments: "Tag options",
      example: `<Tag type={"blue" | "yellow" | "green" | "red"}>some content</Tag>`,
      render: () => {
        const tagOptions: [string, TagTypeOptions][] = [
          ["Default", "blue"],
          ["Warning", "yellow"],
          ["Good", "green"],
          ["Error", "red"],
        ];

        const ExampleTable = TypedTable<typeof tagOptions[0]>();

        return (
          <ExampleTable.Table qa="example" data={tagOptions}>
            <ExampleTable.String header="Name" qa="tag-name" value={([name]) => name} />

            <ExampleTable.Custom
              header="Option"
              qa="tag-option"
              value={([name, option]) => <Tag type={option}>{name}</Tag>}
            />
          </ExampleTable.Table>
        );
      },
    },
  ],
};
