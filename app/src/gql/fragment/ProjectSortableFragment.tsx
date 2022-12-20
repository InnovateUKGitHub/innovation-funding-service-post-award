import { graphql } from "relay-hooks";

const projectSortableFragment = graphql`
  fragment ProjectSortableFragment on accProjectCustom @inline {
    accClaimsForReviewCustom
    accPcRsForReviewCustom
    accPcRsUnderQueryCustom
  }
`;

export { projectSortableFragment };
