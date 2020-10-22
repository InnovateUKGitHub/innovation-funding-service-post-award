
import { Content } from "../../content";
import { ContentPageBase } from "@content/contentPageBase";

export class FooterContent extends ContentPageBase {
    constructor(private readonly content: Content) {
        super(content, "site");
    }

    public readonly supportLinks = this.getContent("site.footer.supportLinks");
    public readonly cookieFindOutMore = this.getContent("site.footer.cookieFindOutMore");
    public readonly crownCopyright = this.getContent("site.footer.crownCopyright");
    public readonly explainCookies = this.getContent("site.footer.explainCookies");

    public readonly govLicenseLinkPart1 = this.getContent("site.footer.externalLinkText.part1");
    public readonly govLicenseLinkPart2 = this.getContent("site.footer.externalLinkText.part2LinkText");
    public readonly govLicenseLinkPart3 = this.getContent("site.footer.externalLinkText.part2");
}
