import camelCase from 'lodash.camelcase';
import startCase from 'lodash.startcase';

/**
 * List of suffixes to replace, along with the replacements.
 */
const suffixReplacements = [
    { suffix: '__c', replacement: 'Custom' },
    { suffix: '__r', replacement: 'Reference' },
] as const;

/**
 * Settings to configure the Salesforce to GraphQL normaliser.
 */
interface IOptions {
    /**
     * Whether the resulting output will be `PascalCase` instead of `camelCase`
     */
    pascalCase?: boolean;
}

/**
 * Convert Salesforce names (field, object, relations, etc.) to those suitable for GraphQL
 *
 * @param name The input Salesforce name to normalise
 * @param options Configuration settings to modify how the input is normalised
 * @returns Normalised Salesforce names, now suitable for use in GraphQL
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
const fieldNameNormalise = (name: string, options: IOptions = {}): string => {
    // Numbers at the start of a name is not valid in JavaScript and GraphQL.
    // Replace all numbers in the name with the text equivalent.
    name = name
        .replace(/1/g, 'One')
        .replace(/2/g, 'Two')
        .replace(/3/g, 'Three')
        .replace(/4/g, 'Four')
        .replace(/5/g, 'Five')
        .replace(/6/g, 'Six')
        .replace(/7/g, 'Seven')
        .replace(/8/g, 'Eight')
        .replace(/9/g, 'Nine')
        .replace(/0/g, 'Zero');

    // Find and replace suffixes with their replacement.
    for (const { suffix, replacement } of suffixReplacements) {
        if (name.endsWith(suffix)) {
            name = name.slice(0, -suffix.length) + replacement;
            break;
        }
    }

    // Convert the name to camelcase.
    name = camelCase(name);

    // If PascalCase is specified, convert the name to `Start Case`, and remove spaces.
    if (options.pascalCase) name = startCase(name).replace(/ /g, '');

    return name;
};

export { fieldNameNormalise };
