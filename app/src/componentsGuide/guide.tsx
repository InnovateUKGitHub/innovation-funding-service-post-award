import * as React from "react";
import { Header } from "../components";
import { datesGuide } from "./datesGuide";
import { projectMemberGuide } from "./projectMemberGuid";
import { emailGuide } from "./emailGuide";

const guides: IGuide[] = [
    datesGuide,
    emailGuide,
    projectMemberGuide
];

interface Props {
    source: string;
    filter: string;
}

export class Guide extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <Header />
                <div className="govuk-width-container" style={{ maxWidth: "100%" }}>
                    <main className="govuk-main-wrapper" id="main-content" role="main" style={{ paddingLeft: "20px;", paddingRight: "20px" }}>
                        <h1 className="govuk-heading-l">The Guide from the {this.props.source}?</h1>
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-one-quarter">
                                {this.renderMenus()}
                            </div>
                            <div className="govuk-grid-column-three-quarters">
                                {this.renderGuides()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    private renderMenus() {
        return <ul><li><a className="govuk-link" href="?">All</a></li>{guides.map((x, i) => <li className="govuk-link" key={`guide-menu-${i}`}><a href={`?guide=${x.name}`}>{x.name}</a></li>)}</ul>;
    }

    private renderGuides() {
        const guidesToRender = this.props.filter ? guides.filter(x => x.name === this.props.filter) : guides;
        return guidesToRender.map(guide => this.renderGuide(guide));
    }

    private renderGuide(guide: { name: string, options: { name: string, example: string, comments: string, render: () => JSX.Element }[] }) {
        return (
            <div>
                <h2 className="govuk-heading-m">{guide.name}</h2>
                {guide.options.map((option, index) => this.renderOptions(option.name, index, option.example, option.comments, option.render))}
            </div>

        );
    }

    private renderOptions(name: string, index: number, example: string, comments: string, render: () => JSX.Element) {
        return (
            <div className="govuk-!-margin-bottom-9" key={`component-option-${index}`}>
                <h3 className="govuk-heading-s">{name}</h3>
                <div style={{ background: "lightGrey", padding: "5px", border: "dashed grey 1px;" }}>
                    <p className="govuk-body"><i>{comments}</i></p>
                    <p className="govuk-body"><pre>{example}</pre></p>
                    <div style={{ background: "white" }}>
                        {render()}
                    </div>
                </div>
            </div>
        );
    }
}
