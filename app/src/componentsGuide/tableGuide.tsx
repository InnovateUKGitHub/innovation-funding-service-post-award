// tslint:disable
import React from "react";
import { range } from "../shared/range";
import { Table } from "../components/table";
import { FullDateTimeWithSeconds } from "../components/renderers";
import { Currency } from "../components/renderers/currency";

const exampleDataItem = (seed: number) => {
    const date = new Date();
    date.setDate(date.getDate() + seed - 1);

    return {
        name: "Example " + seed,
        id: "Record " + (seed + 100),
        created: date,
        cost: seed * 10.35
    };
};

type ExampleData = ReturnType<typeof exampleDataItem>;

const exampleData: ExampleData[] = range(3).map((seed, i) => exampleDataItem(seed));

export const tableGuide: IGuide = {
    name: "Table",
    options: [
        {
            name: "Simple Bound Table",
            comments: "Strongly typed data table",
            example: (
                <div>
                    <p>This is the example for the following data</p>
                    <pre>{JSON.stringify(exampleData, null, 5)}</pre>
                    <pre>{
                        "const ExampleTable = Table.forData(exampleData);\n" +
                        "return (\n" +
                        "\t<ExampleTable.Table>\n" +
                        "\t\t<ExampleTable.Number header=\"Id\" value={(x) => x.id} />\n" +
                        "\t\t<ExampleTable.String header=\"Name\" value={(x) => x.name} />\n" +
                        "\t\t<ExampleTable.Currency header=\"Cost\" value={(x) => x.cost} />\n" +
                        "\t\t<ExampleTable.ShortDate header=\"Created (Short)\" value={(x) => x.created} />\n" +
                        "\t\t<ExampleTable.FullDate header=\"Created (Full)\" value={(x) => x.created} />\n" +
                        "\t</ExampleTable.Table>\n" +
                        ");"}
                    </pre>
                </div>
            ),
            render: () => {
                const ExampleTable = Table.forData(exampleData);
                return (
                    <ExampleTable.Table>
                        <ExampleTable.String header="Id" value={(x) => x.id} />
                        <ExampleTable.String header="Name" value={(x) => x.name} />
                        <ExampleTable.Currency header="Cost" value={(x) => x.cost} />
                        <ExampleTable.ShortDate header="Created (Short)" value={(x) => x.created} />
                        <ExampleTable.FullDate header="Created (Full)" value={(x) => x.created} />
                    </ExampleTable.Table>
                );
            }
        },
        {
            name: "Custom column",
            comments: "Custom columns can also be added",
            example: (
                "const ExampleTable = Table.forData(exampleData);\n" +
                "return (\n" +
                "\t<ExampleTable.Table>\n" +
                "\t\t<ExampleTable.Number header=\"Id\" value={(x) => x.id} />\n" +
                "\t\t<ExampleTable.Custom\n" +
                "\t\t\theader=\"The custom column\"\n" +
                "\t\t\tvalue={(x) => (\n" +
                "\t\t\t\t<span>This is the custom column with tags: <i>{x.name}</i> on <FullDateTimeWithSeconds value={x.created}/></span>\n" +
                "\t\t\t)} />\n" +
                "\t</ExampleTable.Table>\n" +
                ");`"
            ),
            render: () => {
                const ExampleTable = Table.forData(exampleData);
                return (
                    <ExampleTable.Table>
                        <ExampleTable.String header="Id" value={(x) => x.id} />
                        <ExampleTable.Custom
                            header="The custom column"
                            value={(x) => <span>This is the custom column with tags: <i>{x.name}</i> on <FullDateTimeWithSeconds value={x.created} /></span>}
                        />
                    </ExampleTable.Table>
                );
            }

        },
        {
            name: "Footers",
            comments: "Footers can be added to columns",
            example: (
                "const ExampleTable = Table.forData(exampleData);\n" +
                "return (\n" +
                "\t<ExampleTable.Table>\n" +
                "\t\t<ExampleTable.Number \n" +
                "\t\t\tfooter=\"Total costs\"\n" +
                "\t\t\theader=\"Id\"\n" +
                "\t\t\tvalue={(x) => x.id}\n" +
                "\t\t\t/>\n" +
                "\t\t<ExampleTable.Currency\n" +
                "\t\t\tfooter={<Currency value={exampleData.reduce((t, i) => t + i.cost, 0)} />}\n" +
                "\t\t\theader=\"Cost\"\n" +
                "\t\t\tvalue={(x) => x.cost}\n" +
                "\t\t\t/>\n" +
                "\t</ExampleTable.Table>\n" +
                ");"
            ),
            render: () => {
                const ExampleTable = Table.forData(exampleData);
                return (
                    <ExampleTable.Table>
                        <ExampleTable.String footer="Total costs" header="Id" value={(x) => x.id} />
                        <ExampleTable.Currency footer={<Currency value={exampleData.reduce((t, i) => t + i.cost, 0)} />} header="Cost" value={(x) => x.cost} />
                    </ExampleTable.Table>
                );
            }

        }
    ]
};
