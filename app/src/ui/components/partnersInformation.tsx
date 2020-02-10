import React from "react";
import { TypedTable } from "./table";
import { PartnerDto } from "@framework/types";
import { PartnerName } from "@ui/components/partners";
import { Content } from "@content/content";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { ProjectPartnerInformationLabel } from "@content/labels/projectPartnerInformationLabel";

interface Props {
    partners: PartnerDto[];
    partnerInformationLabels: (content: Content) => ProjectPartnerInformationLabel;
}

export const PartnersContactInformation: React.FunctionComponent<Props> = (props) => {
    const partnersContactData = props.partners.map(partner => ({
        partner
    }));
    const PartnersTable = TypedTable<typeof partnersContactData[0]>();

    return (
        <PartnersTable.Table qa="partner-details" data={partnersContactData}>
            <PartnersTable.Custom headerContent={x => props.partnerInformationLabels(x).partnerName()} value={x => <PartnerName partner={x.partner} showIsLead={true} />} qa="partner-name" />
            <PartnersTable.String headerContent={x => props.partnerInformationLabels(x).partnerType()} value={x => x.partner && x.partner.type} qa="partner-type" />
            <PartnersTable.String headerContent={x => props.partnerInformationLabels(x).partnerPostcode()} value={x => x.partner && x.partner.postcode} qa="partner-postcode" />
        </PartnersTable.Table>
    );
};
