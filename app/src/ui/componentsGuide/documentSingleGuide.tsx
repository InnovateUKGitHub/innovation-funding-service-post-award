import React from "react";
import { DocumentSingle } from "../components";
import {ClaimDto} from "@framework/types";
import * as ACC from "../components";

const document = { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1", fileSize: 3, dateCreated: new Date(), owner: "owner1@ownder.com"};
const Form = ACC.TypedForm<ClaimDto>();
const button = <Form.Button name="return">Remove</Form.Button>;

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
