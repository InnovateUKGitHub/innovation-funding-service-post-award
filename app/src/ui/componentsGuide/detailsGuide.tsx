import React from "react";
import { Details } from "../components/details";

export const detailsGuide: IGuide = {
    name: "Details",
    options:[
        {
            name: "Simple",
            comments: "A simple way of laying out details of an item",
            example: (
                "const ItemDetails = Details.forData(data);\n"+
                "return (\n"+
                "    <ItemDetails.Details>\n"+
                "        <ItemDetails.String label=\"Id\" value={x => x.id}/>\n"+
                "        <ItemDetails.String label=\"Name\" value={x => x.name}/>\n"+
                "        <ItemDetails.Date label=\"Started\" value={x => x.created}/>\n"+
                "    </ItemDetails.Details>\n"+
                ");"
            ),
            render: () => {
                const ItemDetails = Details.forData({ id: "Example 1", name: "The Example", created: new Date() });
                return (
                    <ItemDetails.Details>
                        <ItemDetails.String label="Id" value={x => x.id}/>
                        <ItemDetails.String label="Name" value={x => x.name}/>
                        <ItemDetails.DateTime label="Started" value={x => x.created}/>
                    </ItemDetails.Details>
                );
            }
        },
        {
            name: "Double layout",
            comments: "Laying out two columns of details",
            example: (
                "const ItemDetails = Details.forData(data);\n"+
                "return (\n"+
                "    <ItemDetails.Details>\n"+
                "        <ItemDetails.String label=\"Id\" value={x => x.id}/>\n"+
                "        <ItemDetails.String label=\"Name\" value={x => x.name}/>\n"+
                "        <ItemDetails.Date label=\"Started\" value={x => x.created}/>\n"+
                "    </ItemDetails.Details>\n"+
                ");"
            ),
            render: () => {
                const ItemDetails = Details.forData({ id: "Example 1", name: "The Example", created: new Date() });
                return (
                    <ItemDetails.Details layout="Double">
                        <ItemDetails.String label="Id" value={x => x.id}/>
                        <ItemDetails.String label="Name" value={x => x.name}/>
                        <ItemDetails.DateTime label="Started" value={x => x.created}/>
                    </ItemDetails.Details>
                );
            }
        }
    ]
};
