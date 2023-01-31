import { schemaToString } from "./schemaToString";
import { buildSchema } from "graphql";

describe("GraphQL Schema to String", () => {
  describe("schemaToString", () => {
    test("Expect already sorted schema to not change order", () => {
      const sortedSchema = `
        type Hello {
          a: String
          b: Int!
          c: Boolean
        }
      `;

      expect(schemaToString(buildSchema(sortedSchema))).toMatchSnapshot();
    });

    test("Expect type fields to change order", () => {
      const unsortedSchema = `
        type Hello {
          c: Boolean
          a: String
          b: Int!
        }
      `;

      expect(schemaToString(buildSchema(unsortedSchema))).toMatchSnapshot();
    });

    test("Expect multiple types to change order", () => {
      const unsortedSchema = `
        type World {
          d: Boolean
          c: [Int]
          nicole_hedges: Int!
        }

        type Hello {
          c: Boolean
          a: String
          b: Int!
        }

        type Bellows implements Hello {
          c: Boolean
          b: Int!
          d: World!
          a: String
        }
      `;

      expect(schemaToString(buildSchema(unsortedSchema))).toMatchSnapshot();
    });

    test("Expect types and enums to keep order", () => {
      const unsortedSchema = `
        enum ACCOUNTBRAND_SCOPE {
          EVERYTHING
          TEAM
          MINE
          QUEUE_OWNED
          USER_OWNED
        }

        enum THISISATEST {
          APPLE
          ESTROGEN
          BANANA
          DECADES
          CARROT
          FLIGHT
          GARY
        }

        type World {
          d: Boolean
          c: [Int]
          nicole_hedges: Int!
        }

        type Hello {
          c: Boolean
          a: String
          b: Int!
        }

        type Bellows implements Hello {
          c: Boolean
          b: Int!
          d: World!
          a: String
        }
      `;

      expect(schemaToString(buildSchema(unsortedSchema))).toMatchSnapshot();
    });
  });
});
