import * as React from "react";

import { Header } from "../components/layout/header";

import { accordionGuide } from "./accordionGuide";
import { buttonGuide } from "./styledButtonGuide";
import { claimWindowGuide } from "./claimWindowGuide";
import { datesGuide } from "./datesGuide";
import { detailsGuide } from "./detailsGuide";
import { documentListGuide } from "./documentListGuide";
import { documentSingleGuide } from "./documentSingleGuide";
import { emailGuide } from "./emailGuide";
import { formGuide } from "./formGuide";
import { hashTabsGuide } from "./hashTabsGuide";
import { insetText } from "./insetTextGuide";
import { info } from "./infoGuide";
import { linksListGuide } from "./linksListGuide";
import { logsGuide } from "./logsGuide";
import { navigationArrowsGuide } from "./navigationArrowsGuide";
import { navigationCardGuide } from "./navigationCardGuide";
import { numericInputGuide } from "./numericInputGuide";
import { projectContactGuide } from "./projectContactGuide";
import { pageTitleGuide } from "./pageTitleGuide";
import { renderersGuide } from "./renderersGuide";
import { sectionGuide } from "./sectionGuide";
import { sectionPanelGuide } from "./sectionPanelGuide";
import { summaryListGuide } from "./summaryListGuide";
import { tableGuide } from "./tableGuide";
import { tabsGuide } from "./tabsGuide";
import { taskListGuide } from "./taskListGuide";
import { textHint } from "./textHintGuide";
import { validationErrorGuide } from "./validationErrorGuide";
import { validationMessageGuide } from "./validationMessageGuide";
import { validationSummaryGuide } from "./validationSummaryGuide";
import { currencyGuide } from "@ui/componentsGuide/currencyGuide";
import { percentageGuide } from "@ui/componentsGuide/percentageGuide";
import { breadcrumbsGuide } from "@ui/componentsGuide/breadcrumbsGuide";
import { modalGuide } from "@ui/componentsGuide/modalGuide";

const guides: IGuide[] = [
    accordionGuide,
    buttonGuide,
    breadcrumbsGuide,
    claimWindowGuide,
    currencyGuide,
    datesGuide,
    detailsGuide,
    documentListGuide,
    documentSingleGuide,
    emailGuide,
    formGuide,
    info,
    insetText,
    linksListGuide,
    logsGuide,
    modalGuide,
    navigationArrowsGuide,
    navigationCardGuide,
    numericInputGuide,
    projectContactGuide,
    pageTitleGuide,
    percentageGuide,
    renderersGuide,
    sectionGuide,
    sectionPanelGuide,
    summaryListGuide,
    tabsGuide,
    hashTabsGuide,
    tableGuide,
    taskListGuide,
    textHint,
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
                <Header ifsRoot={"https://apply-for-innovation-funding.service.gov.uk"} />
                <div className="govuk-width-container" style={{ maxWidth: "100%" }}>
                    <main className="govuk-main-wrapper" id="main-content" role="main" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                        <h1 className="govuk-heading-l">Components guide</h1>
                        <h2 className="govuk-heading-m">Rendered by the {this.props.source}</h2>
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
        return <ul><li><a className="govuk-link" href="/components#all">Show All</a></li>{guides.map((x, i) => <li className="govuk-link" key={`guide-menu-${i}`}><a href={`/components?guide=${x.name}`}>{x.name}</a></li>)}</ul>;
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
