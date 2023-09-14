import { recordTypeMetaValues } from "@framework/constants/pcrConstants";
import { useContent } from "@ui/hooks/content.hook";

const useGetPcrTypeName = () => {
  const { getContent } = useContent();

  return (name: string): string => {
    const contentSelector = recordTypeMetaValues.find(x => x.typeName === name || x.displayName === name)?.i18nName;

    if (contentSelector) return getContent(contentSelector);
    return "";
  };
};

export { useGetPcrTypeName };
