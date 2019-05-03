import React from "react";
import { connect as reduxConnect } from "react-redux";
import { RootState } from "@framework/ui/redux";

interface Props {
  caption?: string;
}

interface Data {
  storePageTitle: string;
}

class TitleComponent extends React.Component<Props & Data> {
  render() {

    return (
      <div data-qa="page-title">
        {this.renderCaption()}
        <h1 className="govuk-heading-xl clearFix">{this.props.storePageTitle}</h1>
      </div>
    );
  }
  private renderCaption() {
    const { caption } = this.props;
    return caption ? <span className="govuk-caption-xl">{caption}</span> : null;
  }
}

export const Title = reduxConnect<Data, {}, Props, RootState>(
  (state: RootState) => {
    return {
      storePageTitle: state.title.displayTitle
    };
  }
)(TitleComponent);
