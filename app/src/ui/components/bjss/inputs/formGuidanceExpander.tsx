import { ReactNode } from "react";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { DetailContentList } from "./detailContentList";

export interface ExpandedItem {
  header: string;
  description: ReactNode;
}

export interface FormGuidanceExpanderProps {
  title: string;
  items: ExpandedItem[];
  qa: string;
}

export const FormGuidanceExpander = ({ title, items, qa }: FormGuidanceExpanderProps) => (
  <Info summary={title} qa={qa}>
    {!!items.length && <DetailContentList items={items} qa="form-guidance-list" />}
  </Info>
);
