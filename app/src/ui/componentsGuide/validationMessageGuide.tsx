import React from "react";
import { ValidationMessage } from "../components/validationMessage";
import { Result } from "../validation/result";

const message = new Result(null, true,  false, "You can be fined up to £5,000 if you don’t register." ,false);

export const validationMessageGuide: IGuide = {
    name: "Validation Message",
    options: [
        {
            name: "Simple",
            comments: "Renders a validation message and a caption if present",
            example: "ToDo",
            render: () => <ValidationMessage message={message}/>
        }
    ]
};
