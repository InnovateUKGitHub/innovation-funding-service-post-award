import React from "react";
import { TypedTable } from "./table";
import { PartnerDto } from "@framework/types";
import { PartnerName } from "@ui/components/partners";
import { Content } from "@content/content";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";

interface Props {
    partners: PartnerDto[];
    projectContactLabels: (content: Content) => ProjectContactLabels;
}

export const PartnersContactInformation: React.FunctionComponent<Props> = (props) => {

    const PartnersTable = TypedTable<typeof props.partners[0]>();

    return (
        <PartnersTable.Table qa="partner-details" data={props.partners}>
            <PartnersTable.Custom headerContent={x => props.projectContactLabels(x).partnerName()} value={x => <PartnerName partner={x} showIsLead={true} />} qa="partner-name" />
            <PartnersTable.String headerContent={x => props.projectContactLabels(x).partnerType()} value={x => x.type} qa="partner-type" />
            <PartnersTable.String headerContent={x => props.projectContactLabels(x).partnerPostcode()} value={x => x.postcode} qa="partner-postcode" />
        </PartnersTable.Table>
    );
};
