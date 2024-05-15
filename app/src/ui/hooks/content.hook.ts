import {
  // useContext,
  isValidElement,
  useMemo,
  useRef,
} from "react";
import type { ContentSelector, TranslationResult, ContentSelectorCallInformation } from "@copy/type";
// import { contentContext } from "@ui/redux/contentProvider";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { Copy } from "@copy/Copy";

/**
 * Test an input to see if it matches a ContentSelector shape.
 *
 * @param content The input to test
 * @returns Whether the input was a ContentSelector
 * @author Neil Little
 */
export function isContentSolution(content: unknown): content is ContentSelector {
  const isNotString = typeof content !== "string";
  const isFn = typeof content === "function";

  return isNotString && isFn;
}

/**
 * type guard to help evaluate whether field is a valid content selector
 *
 * @param {unknown} item item to be queried for whether it is a content selector
 * @returns {boolean} whether is ContentSelector type
 */
export function isContentSelector(item: unknown): item is ContentSelector {
  return typeof item === "function" && !isValidElement(item);
}

/**
 * Obtain a method to fetch content from the Copy Repository.
 *
 * @returns A competition-type dependant content fetching function.
 * @author Neil Little <neil.little@ukri.org>
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
// export const useContent = () => {
//   // Grab the Content Context
//   const appContent = useContext(contentContext);

//   // Crash out if `useContent` was not called inside the provider.
//   if (!appContent) {
//     throw new Error("useContent() must be used within a <ContentProvider />");
//   }

//   /**
//    * Obtain the localisation of a translation.
//    *
//    * @param contentSelector A function that returns a path to a localisation
//    * @returns The translated message
//    * @author Neil Little <neil.little@ukri.org>
//    * @example
//    * <p>{getContent(x => x.pages.header.siteName)}</p>
//    */
//   const getContent = (contentSelector: ContentSelector | string): TranslationResult => {
//     return appContent.getCopyString(contentSelector);
//   };

//   const getContentCall = (contentSelector: ContentSelector | string): ContentSelectorCallInformation => {
//     return appContent.getContentCall(contentSelector);
//   };

//   return {
//     getContent,
//     getContentCall,
//   };
// };

type PersistentCopyObject = {
  projectId: ProjectId | undefined;
  copy: Copy;
  competitionType: string | undefined;
};

const persistentCopyObject: PersistentCopyObject = {
  projectId: undefined,
  copy: new Copy(),
  competitionType: undefined,
};

export const useContent = (
  {
    projectId,
    monitoringLevel,
    competitionType,
  }: {
    projectId?: ProjectId;
    monitoringLevel?: ProjectMonitoringLevel;
    competitionType?: string;
  } = { projectId: undefined, monitoringLevel: undefined, competitionType: undefined },
) => {
  const persistentCopy = useRef<PersistentCopyObject>(persistentCopyObject);
  return useMemo(() => {
    if (projectId && projectId !== persistentCopy.current.projectId) {
      persistentCopy.current.projectId = projectId;
      persistentCopy.current.competitionType = competitionType;

      persistentCopy.current.copy = new Copy({ competitionType, monitoringLevel });
    }

    const getContent = (contentSelector: ContentSelector | string): TranslationResult => {
      return persistentCopy.current.copy.getCopyString(contentSelector);
    };

    const getContentCall = (contentSelector: ContentSelector | string): ContentSelectorCallInformation => {
      return persistentCopy.current.copy.getContentCall(contentSelector);
    };

    return {
      getContent,
      getContentCall,
      copy: persistentCopy.current.copy,
    };
  }, [projectId, monitoringLevel, competitionType]);
};
