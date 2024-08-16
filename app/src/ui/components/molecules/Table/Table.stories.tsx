import type { Meta, StoryObj } from "@storybook/react";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { FullDateTime } from "@ui/components/atoms/Date";
import { createTypedTable } from "@ui/components/molecules/Table/Table";

type TableType = ReturnType<typeof createTypedTable>["Table"];

const meta: Meta<TableType> = {
  title: "IFSPA Renderer/Table",
};

export default meta;

type Story = StoryObj<TableType>;

interface IData {
  name: string;
  id: string;
  created: Date;
  cost: number;
}

const data = [
  {
    name: "Example 1",
    id: "Record 101",
    created: new Date("2023-05-10T11:06:36.956Z"),
    cost: 10.35,
  },
  {
    name: "Example 2",
    id: "Record 102",
    created: new Date("2023-05-11T11:06:36.956Z"),
    cost: 20.7,
  },
  {
    name: "Example 3",
    id: "Record 103",
    created: new Date("2023-05-12T11:06:36.956Z"),
    cost: 31.049999999999997,
  },
] as IData[];

export const Primary: Story = {
  render() {
    const Table = createTypedTable<IData>();

    return (
      <Table.Table qa="primary-table" data={data}>
        <Table.String qa="col-number" header="Id" value={x => x.id} />
        <Table.String qa="col-string" header="Name" value={x => x.name} />
        <Table.Currency qa="col-currency" header="Cost" value={x => x.cost} />
        <Table.ShortDate qa="col-shortdate" header="Created (Short)" value={x => x.created} />
        <Table.FullDate qa="col-fulldate" header="Created (Full)" value={x => x.created} />
      </Table.Table>
    );
  },
};

export const CustomColumn: Story = {
  render() {
    const Table = createTypedTable<IData>();

    return (
      <Table.Table qa="primary-table" data={data}>
        <Table.String qa="col-string" header="Id" value={x => x.id} />
        <Table.Custom
          qa="col-custom"
          header="The custom column"
          value={x => (
            <span>
              This is the custom column with tags: <i>{x.name}</i> on <FullDateTime value={x.created} />
            </span>
          )}
        />
      </Table.Table>
    );
  },
};

export const CustomFooter: Story = {
  render() {
    const Table = createTypedTable<IData>();

    return (
      <Table.Table qa="primary-table" data={data}>
        <Table.String qa="col-string" footer="Total costs" header="Id" value={x => x.id} />
        <Table.Currency
          qa="col-currency"
          footer={<Currency value={data.reduce((t, i) => t + i.cost, 0)} />}
          header="Cost"
          value={x => x.cost}
        />
      </Table.Table>
    );
  },
};
