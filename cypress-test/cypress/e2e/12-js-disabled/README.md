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
before(function () {
  visitApp({ asUser: jamesBlack, jsDisabled: true });
});
```

and finally every reference to `cy.switchUserTo` should include `jsDisabled: true` as an option

e.g.

```typescript
it("Should now switch user to the same email address but with an uppercase first letter 'James.black@euimeabs.test'", function () {
  cy.switchUserTo("James.black@euimeabs.test", { jsDisabled: true });
  cy.getByQA("pending-and-open-projects").contains("328407");
});
```

with these in place, the tests will now run against a version of the app without the javascript ever loading.

## What if it still looks like javascript is loading?

Probably there is a `switchUserTo` or a `visitApp` without a `{jsDisabled: true}` option passed in.

If still nothing, find a dev and try to obtain support.

## cy.wait("{intercept alias}")

Attempts to intercept a request and wait for it to resolve will fail with js disabled.
Steps doing this should use "cy.wait(time)" instead
Common functions should be extended to accept an options object in which `jsDisabled: true` is an option
and use this to control how waits are handled.

## disabled buttons and other dynamic behaviours

With javascript enabled buttons and inputs should be disabled while requests are in flight.
With javascript disabled this will not happen and any tests asserting this will fail and should be removed.
Also textarea counts will not work with js disabled

## Other suggestions

Rename the description to include js disabled
and also add `{ tags: "js-disabled" }` as the second argument in the description
e.g.

```typescript
describe("my amazing test", function () {
  /* test logic */
});

// becomes

describe("js disabled > my amazing test", { tags: "js-disabled" }, function () {
  /* test logic */
});
```
