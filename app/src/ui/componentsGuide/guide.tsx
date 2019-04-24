import * as React from "react";
import { Header } from "../components";
import { accordionGuide } from "./accordionGuide";
import { claimWindowGuide } from "./claimWindowGuide";
import { datesGuide } from "./datesGuide";
import { detailsGuide } from "./detailsGuide";
import { documentListGuide } from "./documentListGuide";
import { documentSingleGuide } from "./documentSingleGuide";
import { emailGuide } from "./emailGuide";
import { formGuide } from "./formGuide";
import { insetText } from "./insetTextGuide";
import { linksListGuide } from "./linksListGuide";
import { navigationArrowsGuide } from "./navigationArrowsGuide";
import { projectMemberGuide } from "./projectMemberGuide";
import { renderersGuide } from "./renderersGuide";
import { sectionGuide } from "./sectionGuide";
import { sectionPanelGuide } from "./sectionPanelGuide";
import { tableGuide } from "./tableGuide";
import { tabsGuide } from "./tabsGuide";
import { textHint } from "./textHintGuide";
import { titleGuide } from "./titleGuide";
import { validationErrorGuide } from "./validationErrorGuide";
import { validationMessageGuide } from "./validationMessageGuide";
import { validationSummaryGuide } from "./validationSummaryGuide";

const guides: IGuide[] = [
    accordionGuide,
    claimWindowGuide,
    datesGuide,
    detailsGuide,
    documentListGuide,
    documentSingleGuide,
    emailGuide,
    formGuide,
    insetText,
    linksListGuide,
    navigationArrowsGuide,
    projectMemberGuide,
    renderersGuide,
    sectionGuide,
    sectionPanelGuide,
    tabsGuide,
    tableGuide,
    textHint,
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
                <Header ifsRoot={"https://apply-for-innovation-funding.service.gov.uk"}/>
                <div className="govuk-width-container" style={{ maxWidth: "100%" }}>
                    <main className="govuk-main-wrapper" id="main-content" role="main" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
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
        return <ul><li><a className="govuk-link" href="/components">Show All</a></li>{guides.map((x, i) => <li className="govuk-link" key={`guide-menu-${i}`}><a href={`/components?guide=${x.name}`}>{x.name}</a></li>)}</ul>;
    }

    private renderGuides() {
        const guidesToRender = guides.map((guide, originalIndex) => ({ guide, originalIndex })).filter(x => !this.props.filter || x.guide.name === this.props.filter);
        return guidesToRender.map(x => this.renderGuide(x.guide, x.originalIndex));
    }

    private renderGuide(guide: IGuide, index: number) {
        return (
            <div key={`component-${index}`}>
                <h2 className="govuk-heading-m">{guide.name}</h2>
                {guide.options.map((option, optionIndex) => this.renderOptions(option, index, optionIndex))}
            </div>

        );
    }

    private renderOptions(guideOption: IGuideOption, parentIndex: number, index: number) {
        return (
            <div className="govuk-!-margin-bottom-9" key={`component-option-${parentIndex}-${index}`}>
                <h3 className="govuk-heading-s">{guideOption.name}</h3>
                <div style={{ padding: "5px", border: "dashed grey 1px" }}>
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
