# Testing Javascript Disabled

To properly support javascript disabled we want to be able to run tests using cypress against javascript disabled.

## How it works

A header is sent with requests telling the server not to include the `bundle.js` `<script>` tag. This means that the javascript is not sent to the client and only the server rendered version of the app will run.

Because javascript is not actually disabled in the client we can still run the cypress tests in the browser.

## what to do

in each javascript disabled test file in the `beforeEach` block you must call `cy.disableJs()`

e.g.

```typescript
beforeEach(() => {
  cy.disableJS();
});
```

also any references to `visitApp` should include `jsDisabled: true` as an option

e.g.

```typescript
before(() => {
  visitApp({ asUser: jamesBlack, jsDisabled: true });
});
```

and finally every reference to `cy.switchUserTo` should include `jsDisabled: true` as an option

e.g.

```typescript
it("Should now switch user to the same email address but with an uppercase first letter 'James.black@euimeabs.test'", () => {
  cy.switchUserTo("James.black@euimeabs.test", { jsDisabled: true });
  cy.getByQA("pending-and-open-projects").contains("328407");
});
```

with these in place, the tests will now run against a version of the app without the javascript ever loading.

## What if it still looks like javascript is loading?

Probably there is a `switchUserTo` or a `visitApp` without a `{jsDisabled: true}` option passed in.

If still nothing, find a dev and try to obtain support.
