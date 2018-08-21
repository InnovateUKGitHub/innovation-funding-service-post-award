import "jest";
import React from "react";
import { Footer } from "../../../src/components/layout/footer";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Footer", () => {
    describe("footer contains the expected anchor elements", () => {
        it("should render 'Innovate UK' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://www.gov.uk/government/organisations/innovate-uk">Innovate UK</a>))
                .toBeTruthy();
        });
        it("should render 'Innovation Funding Service' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://www.gov.uk/guidance/innovation-apply-for-a-funding-award">Innovation funding advice</a>))
                .toBeTruthy();
        });
        it("should render 'Connect to innovation experts' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://www.gov.uk/guidance/innovation-get-support-and-advice">Connect to innovation experts</a>))
                .toBeTruthy();
        });
        it("should render 'Events' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://connect.innovateuk.org/events">Events</a>))
                .toBeTruthy();
        });
        it("should render 'Innovate UK blog' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://innovateuk.blog.gov.uk/">Innovate UK blog</a>))
                .toBeTruthy();
        });
        it("should render 'GOV.UK accessibility' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://www.gov.uk/help/accessibility">GOV.UK accessibility</a>))
                .toBeTruthy();
        });
        it("should render 'Terms and conditions' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://apply-for-innovation-funding.service.gov.uk/info/terms-and-conditions">Terms and conditions</a>))
                .toBeTruthy();
        });
        it("should render 'Contact us' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://apply-for-innovation-funding.service.gov.uk/info/contact">Contact us</a>))
                .toBeTruthy();
        });
        it("should render 'Sign up for competition updates' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="http://info.innovateuk.org/emailpref">Sign up for competition updates</a>))
                .toBeTruthy();
        });
        it("should render 'Latest funding opportunities' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" target="_blank" href="https://apply-for-innovation-funding.service.gov.uk/competition/search">Latest funding opportunities</a>))
                .toBeTruthy();
        });
        it("should render 'Find out more about cookies' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(
                    <a className="govuk-footer__link" href="https://apply-for-innovation-funding.service.gov.uk/info/cookies">
                        Find out more about cookies
                    </a>
                ))
                .toBeTruthy();
        });
        it("should render 'Open Government Licence v3.0' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">Open Government Licence v3.0</a>))
                .toBeTruthy();
        });
        it("should render '© Crown copyright' <a>", () => {
            const result = Footer({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-footer__link govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>))
                .toBeTruthy();
        });
    });
});
