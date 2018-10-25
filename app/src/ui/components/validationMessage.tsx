import React from "react";

interface Props {
    message: string;
    key?: string;
    messageType: "info" | "error";
}

export const ValidationMessage: React.SFC<Props> = ({ message, key, messageType }) => {
    if (!message) {
        return null;
    }

    let validationColour = "";
    let validationSymbol = "";
    let validationText = "";
    switch (messageType) {
      case "info": {
        validationColour = "#005EA5";
        validationSymbol = "i";
        validationText = "Info";
        break;
      }
      case "error": {
        validationColour = "#B10E1E";
        validationSymbol = "!";
        validationText = "Error";
        break;
      }
    }

    const backgroundStyle = {
      padding: "2% 4% 2% 1%",
      background: "rgb(248, 248, 248, 1)",
      borderLeft: `5px solid ${validationColour}`,
      marginTop: "30px",
      marginBottom: "30px",
    };

    const textStyle = {
      margin: 0,
    };

    const iconStyle = {
      background: validationColour,
      border: validationColour,
    };

    return (
        <div className="govuk-warning-text-background" style={backgroundStyle}>
            <div className="govuk-warning-text" key={key} style={textStyle}>
                <span className="govuk-warning-text__icon" aria-hidden="true" style={iconStyle} >{validationSymbol}</span>
                <strong className="govuk-warning-text__text">
                  <span className="govuk-warning-text__assistive">{validationText}</span>{message}
                </strong>
            </div>
        </div>
    );
};
