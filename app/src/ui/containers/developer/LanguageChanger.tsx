import { CopyLanguages } from "@copy/data";
import { Button, Info } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import i18next from "i18next";
import { useState } from "react";
import { clientInternationalisation } from "src/client/clientInternationalisation";

const LanguageChanger = () => {
  const [currentLanguage, setLanguage] = useState<CopyLanguages>(i18next.language as CopyLanguages);
  const { getContent } = useContent();

  const changeLanguage = (language: CopyLanguages) => {
    console.log("Changing language...", language);
    clientInternationalisation(language);
    setLanguage(language);
  };

  return (
    <Info summary={getContent(x => x.components.languageChanger.sectionTitle({ language: currentLanguage }))}>
      <SimpleString>{getContent(x => x.components.languageChanger.nextRenderDisclaimer)}</SimpleString>
      <Button
        styling="Primary"
        onClick={() => {
          changeLanguage(CopyLanguages.en_GB);
        }}
      >
        {getContent(x => x.components.languageChanger["en-GB"])}
      </Button>
      <Button
        styling="Secondary"
        onClick={() => {
          changeLanguage(CopyLanguages.ifspa_TEST);
        }}
      >
        {getContent(x => x.components.languageChanger["ifspa-TEST"])}
      </Button>
    </Info>
  );
};

export { LanguageChanger };
