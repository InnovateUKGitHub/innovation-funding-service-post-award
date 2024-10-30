import { PCRItemType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";

const nonEditableTypes: PCRItemType[] = [PCRItemType.ProjectTermination];

export const getEditableItemTypes = (pcr: { items: Pick<FullPCRItemDto, "type">[] }) =>
  pcr.items.map(x => x.type).filter(x => !nonEditableTypes.includes(x));
