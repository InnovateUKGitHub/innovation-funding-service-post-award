// You can store state for a single test in the Mocha context.
// Extend this object to stash content.
interface Sirtestalot {}

declare namespace Mocha {
  interface Context extends Sirtestalot {}
}
