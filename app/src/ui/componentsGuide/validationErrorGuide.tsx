import { ValidationError } from "../components/validationError";
import { Result } from "../validation/result";
import { IGuide } from "@framework/types";

const validationError = new Result(null, true, false, "This is a error message for demo purposes", false);

export const validationErrorGuide: IGuide = {
    name: "Validation Errors",
    options: [
        {
            name: "Simple",
            comments: <>Renders a error in a simple link that has error tag for anchor linking.<br/>Will not display until show errors is true and there is an error.</>,
            example: "<ValidationError error={validationError}/>",
            render: () => <ValidationError error={validationError}/>
        }
    ]
};
