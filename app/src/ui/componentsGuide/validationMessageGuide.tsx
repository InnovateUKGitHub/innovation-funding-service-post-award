import React from "react";
import { ValidationMessage} from "../components";
import { IGuide } from "@framework/types";

export const validationMessageGuide: IGuide = {
    name: "Validation Message",
    options: [
      {
        name: "Info message",
        comments: "Renders an info message and a caption if present",
        example: "<ValidationMessage message={\"If you are unsure what evidence to provide, speak to your monitoring officer. They will use these documents when reviewing your claim.\"} messageType={\"info\"}/>",
        render: () => <ValidationMessage message={"If you are unsure what evidence to provide, speak to your monitoring officer. They will use these documents when reviewing your claim."} messageType={"info"}/>
      },
      {
        name: "Error",
        comments: "Renders an error message and a caption if present",
        example: "<ValidationMessage message={\"You can be fined up to £5,000 if you don’t register.\"} messageType={\"error\"}/>",
        render: () => <ValidationMessage message={"You can be fined up to £5,000 if you don’t register."} messageType={"error"}/>
      },
      {
        name: "Success",
        comments: "Renders an success message and a caption if present",
        example: "<ValidationMessage message={\"You must provide a file to proceed.\"} messageType={\"success\"}/>",
        render: () => <ValidationMessage message={"You must provide a file to proceed."} messageType={"success"} />
      },
      {
        name: "Warning",
        comments: "Renders an warning message and a caption if present",
        example: "<ValidationMessage message={\"You must provide a file to proceed.\"} messageType={\"warning\"}/>",
        render: () => <ValidationMessage message={"You must provide a file to proceed."} messageType={"warning"} />
      },
      {
        name: "Alert",
        comments: "Renders an alert message and a caption if present",
        example: "<ValidationMessage message={\"Be careful.\"} messageType={\"alert\"}/>",
        render: () => <ValidationMessage message={"Be careful."} messageType={"alert"} />
      }
    ]
};
