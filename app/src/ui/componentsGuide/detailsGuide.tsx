import React from "react";
import {Details, DualDetails} from "../components/details";

export const detailsGuide: IGuide = {
    name: "Details",
    options:[
        {
            name: "Simple",
            comments: "A simple way of laying out details of an item",
            example: (
                "const ItemDetails = Details.forData(data);\n"+
                "return (\n"+
                "    <ItemDetails.Details labelWidth=\"Narrow\">\n"+
                "        <ItemDetails.String label=\"Id\" value={x => x.id}/>\n"+
                "        <ItemDetails.String label=\"Name\" value={x => x.name}/>\n"+
                "        <ItemDetails.Date label=\"Started\" value={x => x.created}/>\n"+
                "    </ItemDetails.Details>\n"+
                ");"
            ),
            render: () => {
                const ItemDetails = Details.forData({ id: "Example 1", name: "Simple Example", created: new Date() });
                return (
                    <ItemDetails.Details labelWidth="Narrow">
                        <ItemDetails.String label="Id" value={x => x.id}/>
                        <ItemDetails.String label="Name" value={x => x.name}/>
                        <ItemDetails.DateTime label="Started" value={x => x.created}/>
                    </ItemDetails.Details>
                );
            }
        },{
            name: "Compact",
            comments: "A way of laying out details of an item in a more compact way",
            example: (
                "const ItemDetails = Details.forData(data);\n"+
                "return (\n"+
                "    <ItemDetails.Details displayDensity=\"Compact\" labelWidth=\"Narrow\">\n"+
                "        <ItemDetails.String label=\"Id\" value={x => x.id}/>\n"+
                "        <ItemDetails.String label=\"Name\" value={x => x.name}/>\n"+
                "        <ItemDetails.Date label=\"Started\" value={x => x.created}/>\n"+
                "    </ItemDetails.Details>\n"+
                ");"
            ),
            render: () => {
                const ItemDetails = Details.forData({ id: "Example 1", name: "Compact Example", created: new Date() });
                return (
                    <ItemDetails.Details displayDensity="Compact" labelWidth="Narrow">
                        <ItemDetails.String label="Id" value={x => x.id}/>
                        <ItemDetails.String label="Name" value={x => x.name}/>
                        <ItemDetails.DateTime label="Started" value={x => x.created}/>
                    </ItemDetails.Details>
                );
            }
        },
        {
            name: "Double layout",
            comments: "Laying out two columns of details. Props passed to DualDetails will be passed to all nested Details",
            example: (
                `const ItemDetails = Details.forData(data);
                return (
                    <DualDetails>
                        <ItemDetails.Details>
                            <ItemDetails.String label="Id" value={x => x.id}/>
                            <ItemDetails.String label="Name" value={x => x.name}/>
                        </ItemDetails.Details>
                        <ItemDetails.Details>
                            <ItemDetails.DateTime label="Started" value={x => x.created}/>
                        </ItemDetails.Details>
                    </DualDetails>
                );`
            ),
            render: () => {
                const ItemDetails = Details.forData({ id: "Example 1", name: "Dual Example", created: new Date() });
                return (
                    <DualDetails>
                        <ItemDetails.Details>
                            <ItemDetails.String label="Id" value={x => x.id}/>
                            <ItemDetails.String label="Name" value={x => x.name}/>
                        </ItemDetails.Details>
                        <ItemDetails.Details>
                            <ItemDetails.DateTime label="Started" value={x => x.created}/>
                        </ItemDetails.Details>
                    </DualDetails>
                );
            }
        }
    ]
};
