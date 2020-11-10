import React from "react";
import {DualDetails, TypedDetails} from "../components/details";
import { IGuide } from "@framework/types";

export const detailsGuide: IGuide = {
    name: "Details",
    options:[
        {
            name: "Simple",
            comments: "A simple way of laying out details of an item",
            example: (
                "const ItemDetails = TypedDetails<typeof data>();\n"+
                "return (\n"+
                "    <ItemDetails.Details labelWidth=\"Narrow\" data={data}>\n"+
                "        <ItemDetails.String label=\"Id\" value={x => x.id}/>\n"+
                "        <ItemDetails.String label=\"Name\" value={x => x.name}/>\n"+
                "        <ItemDetails.Date label=\"Started\" value={x => x.created}/>\n"+
                "    </ItemDetails.Details>\n"+
                ");"
            ),
            render: () => {
                const data =  { id: "Example 1", name: "Simple Example", created: new Date() };
                const ItemDetails = TypedDetails<typeof data>();
                return (
                    <ItemDetails.Details labelWidth="Narrow" data={data}>
                        <ItemDetails.String label="Id" qa="id" value={x => x.id}/>
                        <ItemDetails.String label="Name" qa="name" value={x => x.name}/>
                        <ItemDetails.DateTime label="Started" qa="started" value={x => x.created}/>
                    </ItemDetails.Details>
                );
            }
        },{
            name: "Compact",
            comments: "A way of laying out details of an item in a more compact way",
            example: (
                "const ItemDetails = TypedDetails<typeof data>();\n"+
                "return (\n"+
                "    <ItemDetails.Details displayDensity=\"Compact\" labelWidth=\"Narrow\" data={data}>\n"+
                "        <ItemDetails.String label=\"Id\" value={x => x.id}/>\n"+
                "        <ItemDetails.String label=\"Name\" value={x => x.name}/>\n"+
                "        <ItemDetails.Date label=\"Started\" value={x => x.created}/>\n"+
                "    </ItemDetails.Details>\n"+
                ");"
            ),
            render: () => {
                const data = { id: "Example 1", name: "Compact Example", created: new Date() };
                const ItemDetails = TypedDetails<typeof data>();
                return (
                    <ItemDetails.Details displayDensity="Compact" labelWidth="Narrow" data={data}>
                        <ItemDetails.String label="Id" qa="id" value={x => x.id}/>
                        <ItemDetails.String label="Name" qa="name" value={x => x.name}/>
                        <ItemDetails.DateTime label="Started" qa="started" value={x => x.created}/>
                    </ItemDetails.Details>
                );
            }
        },
        {
            name: "Double layout",
            comments: "Laying out two columns of details. Props passed to DualDetails will be passed to all nested Details",
            example: (
                `const ItemDetails = TypedDetails<typeof data>();
                return (
                    <DualDetails>
                        <ItemDetails.Details data={data}>
                            <ItemDetails.String label="Id" qa="id" value={x => x.id}/>
                            <ItemDetails.String label="Name" qa="name" value={x => x.name}/>
                        </ItemDetails.Details>
                        <ItemDetails.Details data={data}>
                            <ItemDetails.DateTime label="Started" qa="started" value={x => x.created}/>
                        </ItemDetails.Details>
                    </DualDetails>
                );`
            ),
            render: () => {
                const data = { id: "Example 1", name: "Dual Example", created: new Date() };
                const ItemDetails = TypedDetails<typeof data>();
                return (
                    <DualDetails>
                        <ItemDetails.Details title="Title one the one" data={data}>
                            <ItemDetails.String label="Id" qa="id" value={x => x.id}/>
                            <ItemDetails.String label="Name" qa="name" value={x => x.name}/>
                        </ItemDetails.Details>
                        <ItemDetails.Details title="Title two the two" data={data}>
                            <ItemDetails.DateTime label="Started" qa="started" value={x => x.created}/>
                        </ItemDetails.Details>
                    </DualDetails>
                );
            }
        }
    ]
};
