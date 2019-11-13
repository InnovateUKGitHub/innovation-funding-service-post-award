import React from "react";
import { Markdown, SimpleString } from "../components/renderers";

export const renderersGuide: IGuide = {
    name: "Renderers",
    options: [
        {
            name: "SimpleString",
            comments: "Renders a simple string with includes gov.uk style",
            example: "<SimpleString>You need to review your forecasts before you can submit your claim.</SimpleString>",
            render: () => <SimpleString>You need to review your forecasts before you can submit your claim.</SimpleString>
        },
        {
            name: "Markdown",
            comments: "Renders a span with markdown converted to html",
            example: `<Markdown value={markdownContent}/>`,
            render: () => <MarkdownGuide />
        }
    ]
};

class MarkdownGuide extends React.Component<{}, { markdownContent: string }> {
    constructor(props: {}) {
        super(props);
        this.state = { markdownContent: "Loading..." };
        if (fetch) {
            fetch("https://raw.githubusercontent.com/facebook/react/master/README.md")
                .then(response => response.text())
                .then(markdownContent => this.setState({ markdownContent }))
                .catch(e => this.setState({ markdownContent: "Failed" }));
        }
    }

    render() {
        return <Markdown value={this.state.markdownContent} />;
    }
}
