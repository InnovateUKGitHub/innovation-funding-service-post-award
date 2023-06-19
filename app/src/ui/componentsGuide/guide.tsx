import React from "react";
import { Header } from "../components/layout/header";

import { accordionGuide } from "./accordionGuide";
import { buttonGuide } from "./styledButtonGuide";
import { datesGuide } from "./datesGuide";
import { detailsGuide } from "./detailsGuide";
import { documentListGuide } from "./documentListGuide";
import { documentComponents } from "./documentsComponentsGuide";
import { emailGuide } from "./emailGuide";
import { formGuide } from "./formGuide";
import { info } from "./infoGuide";
import { linksListGuide } from "./linksListGuide";
import { logsGuide } from "./logsGuide";
import { navigationArrowsGuide } from "./navigationArrowsGuide";
import { navigationCardGuide } from "./navigationCardGuide";
import { numericInputGuide } from "./numericInputGuide";
import { pageTitleGuide } from "./pageTitleGuide";
import { renderersGuide } from "./renderersGuide";
import { sectionGuide } from "./sectionGuide";
import { sectionPanelGuide } from "./sectionPanelGuide";
import { summaryListGuide } from "./summaryListGuide";
import { tableGuide } from "./tableGuide";
import { taskListGuide } from "./taskListGuide";
import { tagGuide } from "./tagGuide";
import { textHint } from "./textHintGuide";
import { validationErrorGuide } from "./validationErrorGuide";
import { validationMessageGuide } from "./validationMessageGuide";
import { validationSummaryGuide } from "./validationSummaryGuide";
import { currencyGuide } from "@ui/componentsGuide/currencyGuide";
import { percentageGuide } from "@ui/componentsGuide/percentageGuide";
import { modalGuide } from "@ui/componentsGuide/modalGuide";
import { listGuide } from "@ui/componentsGuide/listGuide";
import { readonlyLabel } from "@ui/componentsGuide/readonlyLabelGuide";
import { textareaInputGuide } from "./textareaInputGuide";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { GovWidthContainer } from "@ui/components/layout/GovWidthContainer";
import { UL } from "@ui/components/layout/list";
import { IGuide } from "@framework/types/IGuide";
import { H1, H2, H3 } from "@ui/components/typography/Heading.variants";

const guides: IGuide[] = [
  accordionGuide,
  buttonGuide,
  currencyGuide,
  datesGuide,
  detailsGuide,
  documentListGuide,
  documentComponents,
  emailGuide,
  formGuide,
  info,
  linksListGuide,
  listGuide,
  logsGuide,
  modalGuide,
  navigationArrowsGuide,
  navigationCardGuide,
  numericInputGuide,
  textareaInputGuide,
  pageTitleGuide,
  percentageGuide,
  readonlyLabel,
  renderersGuide,
  sectionGuide,
  sectionPanelGuide,
  summaryListGuide,
  tableGuide,
  taskListGuide,
  tagGuide,
  textHint,
  validationMessageGuide,
  validationErrorGuide,
  validationSummaryGuide,
];

interface GuideProps {
  source: string;
  filter: string;
}

const hostname = typeof window !== "undefined" ? window.location.origin : process?.env.SERVER_URL;

export const Guide: React.FunctionComponent<GuideProps> = props => {
  const guidesToRender = guides
    .map((guide, originalIndex) => ({ guide, originalIndex }))
    .filter(x => !props.filter || x.guide.name === props.filter);

  return (
    <div>
      <Header showMenu={false} headingLink={`${hostname}/components`} />

      <GovWidthContainer style={{ maxWidth: "100%" }}>
        <main
          className="govuk-main-wrapper"
          id="main-content"
          role="main"
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
        >
          <H1 className="govuk-heading-l">Components guide</H1>
          <H2 className="govuk-heading-m">Rendered by the {props.source}</H2>

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-quarter">
              <UL>
                <li>
                  <a className="govuk-link" href="/components#all">
                    Show All
                  </a>
                </li>

                {guides.map((x, i) => (
                  <li className="govuk-link" key={`guide-menu-${i}`}>
                    <a href={`/components?guide=${x.name}`}>{x.name}</a>
                  </li>
                ))}
              </UL>
            </div>

            <div className="govuk-grid-column-three-quarters">
              {guidesToRender.map(({ guide, originalIndex }) => (
                <div key={`component-${originalIndex}`}>
                  <H2 className="govuk-heading-m">{guide.name}</H2>

                  {guide.options.map((option, optionIndex) => (
                    <div className="govuk-!-margin-bottom-9" key={`component-option-${originalIndex}-${optionIndex}`}>
                      <H3 className="govuk-heading-s">{option.name}</H3>
                      <div style={{ padding: "5px", border: "dashed grey 1px" }}>
                        <SimpleString>
                          <i>{option.comments}</i>
                        </SimpleString>

                        <div style={{ backgroundColor: "lightGrey", overflowX: "auto" }}>
                          <pre>{option.example}</pre>
                        </div>
                        <div style={{ background: "white" }}>{option.render()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </GovWidthContainer>
    </div>
  );
};
