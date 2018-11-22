import React from "react";
import { DocumentSingle } from "../components";
import {ClaimDto} from "../../types";
import * as ACC from "../components";

const document = { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1"};

const Form = ACC.TypedForm<ClaimDto>();
const button = <Form.Button name="return" onClick={() => console.log("clicked")}>Remove</Form.Button>;

export const documentSingleGuide: IGuide = {
    name: "DocumentSingle",
    options: [
        {
            name: "Simple",
            comments: "Renders a DocumentSingle component",
            example: "<DocumentSingle message={\"test\"} document={document} qa={\"qa\"}/>",
            render: () => <DocumentSingle message={"An IAR has been added to this claim"} document={document} qa={"qa"} renderRemove={() => button}/>
        }
    ]
};
