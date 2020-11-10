// tslint:disable
import React from "react";
import { range } from "../../shared/range";
import { TypedTable } from "../components/table";
import { FullDateTime } from "../components/renderers";
import { Currency } from "../components/renderers/currency";
import { IGuide } from "@framework/types";

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
                        "const ExampleTable = TypedTable<ExampleData>();\n" +
                        "return (\n" +
                        "\t<ExampleTable.Table data={exampleData}>\n" +
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
                const ExampleTable = TypedTable<ExampleData>();
                return (
                    <ExampleTable.Table qa="example" data={exampleData}>
                        <ExampleTable.String header="Id" qa="id" value={(x) => x.id} />
                        <ExampleTable.String header="Name" qa="name" value={(x) => x.name} />
                        <ExampleTable.Currency header="Cost" qa="cost" value={(x) => x.cost} />
                        <ExampleTable.ShortDate header="Created (Short)" qa="created-short" value={(x) => x.created} />
                        <ExampleTable.FullDate header="Created (Full)" qa="created-long" value={(x) => x.created} />
                    </ExampleTable.Table>
                );
            }
        },
        {
            name: "Custom column",
            comments: "Custom columns can also be added",
            example: (
                "const ExampleTable = TypedTable<ExampleData>();\n" +
                "return (\n" +
                "\t<ExampleTable.Table data={exampleData}>\n" +
                "\t\t<ExampleTable.Number header=\"Id\" value={(x) => x.id} />\n" +
                "\t\t<ExampleTable.Custom\n" +
                "\t\t\theader=\"The custom column\"\n" +
                "\t\t\tvalue={(x) => (\n" +
                "\t\t\t\t<span>This is the custom column with tags: <i>{x.name}</i> on <FullDateTime value={x.created}/></span>\n" +
                "\t\t\t)} />\n" +
                "\t</ExampleTable.Table>\n" +
                ");`"
            ),
            render: () => {
                const ExampleTable = TypedTable<ExampleData>();
                return (
                    <ExampleTable.Table qa="example" data={exampleData}>
                        <ExampleTable.String header="Id" qa="id" value={(x) => x.id} />
                        <ExampleTable.Custom
                            header="The custom column"
                            qa="custom" 
                            value={(x) => <span>This is the custom column with tags: <i>{x.name}</i> on <FullDateTime value={x.created} /></span>}
                        />
                    </ExampleTable.Table>
                );
            }

        },
        {
            name: "Footers",
            comments: "Footers can be added to columns",
            example: (
                "const ExampleTable = TypedTable<ExampleData>();\n" +
                "return (\n" +
                "\t<ExampleTable.Table data={exampleData}>\n" +
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
                const ExampleTable = TypedTable<ExampleData>();
                return (
                    <ExampleTable.Table qa="example" data={exampleData}>
                        <ExampleTable.String footer="Total costs" header="Id" qa="id" value={(x) => x.id} />
                        <ExampleTable.Currency footer={<Currency value={exampleData.reduce((t, i) => t + i.cost, 0)} />} header="Cost" qa="cost"  value={(x) => x.cost} />
                    </ExampleTable.Table>
                );
            }

        }
    ]
};
