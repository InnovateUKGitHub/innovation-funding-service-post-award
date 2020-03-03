import React from "react";
import * as ACC from "@ui/components";
import { Content } from "@content/content";
import { DocumentMessages } from "@content/messages/documentMessages";

export const DocumentGuidance = (props: {}) => {
  return (
    <React.Fragment>
      <ACC.Renderers.SimpleString>You can upload up to 10 documents at a time. Each document must:</ACC.Renderers.SimpleString>
      <ACC.UnorderedList>
        <li>be less than 10MB in file size</li>
        <li>have a unique file name that describes its contents</li>
      </ACC.UnorderedList>
      <ACC.Renderers.SimpleString>There is no limit to the number of files you can upload in total.</ACC.Renderers.SimpleString>
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
    </React.Fragment>
  );
};

export const DocumentGuidanceWithContent = (props: { documentMessages: (x: Content) => DocumentMessages }) => {
  return (
    <React.Fragment>
      <ACC.Content value={x => props.documentMessages(x).header()}/>
      <ACC.Info summary={<ACC.Content value={x => props.documentMessages(x).infoTitle()}/>}>
        <ACC.Content value={x => props.documentMessages(x).infoContent()}/>
      </ACC.Info>
    </React.Fragment>
  );
};
