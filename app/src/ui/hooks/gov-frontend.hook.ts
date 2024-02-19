import { useCallback } from "react";
import { Accordion, Button, CharacterCount, Checkboxes, ErrorSummary, Header, Radios } from "govuk-frontend";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";

const gdsModules = {
  Accordion,
  Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
};

const useGovFrontend = (gdsModule: keyof typeof gdsModules) => {
  const { isClient } = useMounted();

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (!isClient || !node) return;

      // If the web browser supports GOV.UK Frontend, initialise the component
      if ("noModule" in HTMLScriptElement.prototype) {
        window.document.body.classList.add("govuk-frontend-supported");
        new gdsModules[gdsModule](node);
      }
    },
    [gdsModules, gdsModule, isClient],
  );

  return { setRef };
};

export { useGovFrontend, gdsModules };
