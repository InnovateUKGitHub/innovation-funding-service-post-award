import React from "react";
import { ValidationSummary } from "../components/validationSummary";
import { IGuide } from "@framework/types";
import { Results } from "../validation/results";
import * as Validation from "../validators/common";

const exampleDto = {
    amount: 10,
    text: "A string",
    anEmptyField : "",
};

class ExampleValidator extends Results<typeof exampleDto> {
    amount = Validation.isTrue(this, this.model.amount > 10, "Amount must be greater than 10");
    test = Validation.required(this, this.model.text);
    anEmptyField = Validation.required(this, this.model.anEmptyField);
}

export const validationSummaryGuide: IGuide = {
    name: "Validation Summary",
    options: [
        {
            name: "Simple",
            comments: <React.Fragment>Renders a list of errors with anchor links to the relevent error.<br/>Will not display until show errors is true and there is an error.</React.Fragment>,
            example: "<ValidationError error={validationError}/>",
            render: () => <ValidationSummary validation={new ExampleValidator(exampleDto, true)}/>
        }
    ]
};
