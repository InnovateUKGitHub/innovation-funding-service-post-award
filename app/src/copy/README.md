# Copy!

> _noun_: **text that is to be printed, or text that is used to sell a product**
>
> - Cambridge Dictionary, https://dictionary.cambridge.org/dictionary/english/copy

"Copy" in IFS PA refers to text that is displayed to our end users.
This data is (as of writing) spread out between three different types of "Content Repositories"

- Default Content
  - `default.en-GB.json`
- Custom Content
  - Loaded from an Amazon Web Services S3 bucket
- Competition Content
  - `ktp.en-GB.json`
  - `loans.en-GB.json`
  - `sbri-ifs.en-GB.json`
  - `sbri.en-GB.json`

_Default Content_ can be overlaid with _Competition Content_, which is automatically switched to
when you browse to a page associated with a project. These competition contents utilise `i18next`'s
namespace feature to ensure automatic callback to the default namespace.

[Learn more about namespaces on their website](https://www.i18next.com/principles/namespaces)

## Using Copy

There are two ways to consume Copy; with the `<Content />` component, or with the `useContent()`
React hook. The component allows you to consume Copy in any component that you are building, whilst
`useContent()` always returns a string, which can be passed to more components.

To grab content, pass a function `x =>`, and return the Copy within `x` that you need.
Microsoft Intellisense helps, as structural information is interpreted directly from the JSON file.

For example:

```jsx
// With useContent() hook.
const { getContent } = useContent();
return <p>{getContent(x => x.example.contentTitle)}</p>;
```

```jsx
// With a TSX "Content" component.
return <Content value={x => x.example.contentTitle} />;
```

Optional data may be passed in by calling the "Content Selector" with a key-value record.

```jsx
// With a TSX "Content" component.
return <Content value={x => x.documentMessages.allowedFiles({ count: 5 })} />;
```

## Markdown

Some copy is stored as Markdown. To render this text, use the `<Content />` component with the
`markdown` boolean prop applied.

```jsx
return <Content markdown value={x => x.example.documentGuidance} />;
```

## Pluralisation

**Do not check for plurals in code.**

_i18next_ has support for plurals built-in. Learn more [on their website](https://www.i18next.com/translation-function/plurals)
