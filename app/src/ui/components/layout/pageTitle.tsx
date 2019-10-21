import React from "react";
import { StoresConsumer } from "@ui/redux";

interface Props {
  title?: string;
  caption?: string;
}

interface Data {
  storePageTitle: string;
}

class PageTitleComponent extends React.Component<Props & Data> {
  render() {

    return (
      <div data-qa="page-title">
        {this.renderCaption()}
        <h1 className="govuk-heading-xl clearFix">{this.props.title || this.props.storePageTitle}</h1>
      </div>
    );
  }

  private renderCaption() {
    const { caption } = this.props;
    return caption ? <span className="govuk-caption-xl">{caption}</span> : null;
  }
}

export const PageTitle = (props: Props) => (
  <StoresConsumer>
    {stores => <PageTitleComponent storePageTitle={stores.navigation.getPageTitle().displayTitle} {...props}/>}
  </StoresConsumer>
);
