import { useContent } from "@ui/hooks/content.hook";
import { AccessibilityText } from "../../AccessibilityText/AccessibilityText";

const TableEmptyCell = () => {
  const { getContent } = useContent();

  return <AccessibilityText>{getContent(x => x.components.table.noDataText)}</AccessibilityText>;
};

export { TableEmptyCell };
