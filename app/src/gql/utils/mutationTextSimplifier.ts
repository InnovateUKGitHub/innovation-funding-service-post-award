import crypto from "crypto";

export const removeDirectives = (text: string, isServerMutation: boolean) => {
  let curlyBraceCount = 0;
  let matchingDirective = false;
  let directiveOpenBracket = -1;
  const nextText: string[] = [];

  if (isServerMutation) {
    // go through each character
    for (let i = 0; i < text.length; i++) {
      // if we find an `@` symbol and check to see if it matches the @include directive
      if (text[i] === "@") {
        if (text.substring(i, i + 8) === "@include") {
          // set the matching directive flag to true
          matchingDirective = true;
        }
      }

      // if the matchingDirective flag is true we begin the parsing operation
      if (matchingDirective) {
        // if we see an opening curly brace
        if (text[i] === "{") {
          // increment the curly brace count
          curlyBraceCount++;
          if (curlyBraceCount === 1) {
            // if it is the first time we see open brace, set the directiveOpenBracket to current index
            directiveOpenBracket = i;
          }
        }

        if (text[i] === "}") {
          // if we see a closing curly brace decrement the curly brace count
          curlyBraceCount--;
        }
        if (curlyBraceCount === 0 && directiveOpenBracket !== -1) {
          // if the curly brace count is 0 and the directive open bracket is not -1 we know that we have found the end of the directive
          const endOfDirective = i;
          const innerText = text.substring(directiveOpenBracket, endOfDirective + 1);
          nextText.push(innerText);
          directiveOpenBracket = -1;
          matchingDirective = false;
        }
      } else {
        nextText.push(text[i]);
      }
    }
    return nextText.join("");
  } else {
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ".") {
        if (text.substring(i, i + 12) === "... @include") {
          matchingDirective = true;
        }
      }

      if (matchingDirective) {
        if (text[i] === "{") {
          curlyBraceCount++;
          if (curlyBraceCount === 1) {
            directiveOpenBracket = i;
          }
        }

        if (text[i] === "}") {
          curlyBraceCount--;
        }
        if (curlyBraceCount === 0 && directiveOpenBracket !== -1) {
          const endOfDirective = i;
          const innerText = text.substring(directiveOpenBracket + 1, endOfDirective);
          nextText.push(innerText);
          directiveOpenBracket = -1;
          matchingDirective = false;
        }
      } else {
        nextText.push(text[i]);
      }
    }
    return nextText.join("");
    // return text.replace(/\.\.\.\s?@include\(if: \$\w+\) {([\s\S]*?)}[\s]*\)/g, "$1");
  }
};

export const mutationTextSimplifier = (mutationText: string, isServerMutation: boolean) =>
  removeDirectives(mutationText, isServerMutation)
    .trim()
    .replaceAll(/[\s\n,]/g, "");

const getHash = (str: string) => {
  const hash = crypto.createHash("md5");
  hash.update(str);
  return hash.digest("hex");
};

export const getMutationHash = (mutationText: string, isServerMutation: boolean) => {
  const simplifiedMutationText = mutationTextSimplifier(mutationText, isServerMutation);

  return getHash(simplifiedMutationText);
};
