import React from "react";
import * as ACC from "@ui/components";

interface Props {
    additionalComments?: string;
}

export const DocumentGuidance = (props: Props) => {
    const classNames = "govuk-list govuk-list--bullet govuk-!-margin-bottom-10";
    return (
        <ACC.Section>
            <ACC.Renderers.SimpleString>{props.additionalComments} You can upload up to 10 documents at a time. Each document must:</ACC.Renderers.SimpleString>
            <ul className={classNames}>
                <li>be less than 10MB in file size</li>
                <li>have a unique file name that describes its contents</li>
            </ul>
            <ACC.Info summary="What file types can I upload?">
                <p>You can upload these file types:</p>
                <ul>
                    <li>PDF (pdf, xps)</li>
                    <li>text (doc, docx, rdf, txt, csv, odt)</li>
                    <li>presentation (ppt, pptx, odp)</li>
                    <li>spreadsheet (xls, xlsx, ods)</li>
                    <li>image (jpg, jpeg, png)</li>
                </ul>
            </ACC.Info>
        </ACC.Section>
    );
};
