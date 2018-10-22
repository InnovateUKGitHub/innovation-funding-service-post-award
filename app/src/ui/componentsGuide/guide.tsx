import * as React from "react";
import { Header } from "../components";
import { datesGuide } from "./datesGuide";
import { projectMemberGuide } from "./projectMemberGuide";
import { emailGuide } from "./emailGuide";
import { sectionGuide } from "./sectionGuide";
import { sectionPanelGuide } from "./sectionPanelGuide";
import { tabsGuide } from "./tabsGuide";
import { titleGuide } from "./titleGuide";
import { linksListGuide } from "./linksListGuide";
import { tableGuide } from "./tableGuide";
import { detailsGuide } from "./detailsGuide";
import { formGuide } from "./formGuide";
import { validationMessageGuide } from "./validationMessageGuide";
import { validationErrorGuide } from "./validationErrorGuide";
import { validationSummaryGuide } from "./validationSummaryGuide";
import { renderersGuide } from "./renderersGuide";
import { insetText } from "./insetTextGuide";

const guides: IGuide[] = [
    datesGuide,
    detailsGuide,
    emailGuide,
    formGuide,
    insetText,
    linksListGuide,
    projectMemberGuide,
    renderersGuide,
    sectionGuide,
    sectionPanelGuide,
    tabsGuide,
    tableGuide,
    titleGuide,
    validationMessageGuide,
    validationErrorGuide,
    validationSummaryGuide
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

    private renderGuide(guide: IGuide) {
        return (
            <div>
                <h2 className="govuk-heading-m">{guide.name}</h2>
                {guide.options.map((option, index) => this.renderOptions(option, index))}
            </div>

        );
    }

    private renderOptions(guideOption: IGuideOption, index: number) {
        return (
            <div className="govuk-!-margin-bottom-9" key={`component-option-${index}`}>
                <h3 className="govuk-heading-s">{guideOption.name}</h3>
                <div style={{ padding: "5px", border: "dashed grey 1px;" }}>
                    <p className="govuk-body"><i>{guideOption.comments}</i></p>
                    <div style={{ backgroundColor: "lightGrey" }}><pre>{guideOption.example}</pre></div>
                    <div style={{ background: "white" }}>
                        {guideOption.render()}
                    </div>
                </div>
            </div>
        );
    }
}
