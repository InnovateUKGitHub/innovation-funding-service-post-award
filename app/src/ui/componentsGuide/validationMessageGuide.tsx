import React from "react";
import { ValidationMessage} from "../components";

export const validationMessageGuide: IGuide = {
    name: "Validation Message",
    options: [
      {
        name: "Info message",
        comments: "Renders an info message and a caption if present",
        example: "<ValidationMessage message={\"You can be fined up to £5,000 if you don’t register.\"} messageType={\"info\"}/>",
        render: () => <ValidationMessage message={"If you are unsure what evidence to provide, speak to your Monitoring Officer. They will use these documents when reviewing your claim.."} messageType={"info"}/>
      },
      {
        name: "Error",
        comments: "Renders an error message and a caption if present",
        example: "<ValidationMessage message={\"If you are unsure what evidence to provide, speak to your Monitoring Officer. They will use these documents when reviewing your claim.\"} messageType={\"error\"}/>",
        render: () => <ValidationMessage message={"You can be fined up to £5,000 if you don’t register."} messageType={"error"}/>
      },
      {
        name: "Success",
        comments: "Renders an success message and a caption if present",
        example: "<ValidationMessage message={\"Your file has been uploaded.\"} messageType={\"success\"}/>",
        render: () => <ValidationMessage message={"Your file has been uploaded."} messageType={"success"} />
      }
    ]
};
