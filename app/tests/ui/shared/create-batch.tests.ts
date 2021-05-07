import { createBatch } from "@shared/create-batch";

const stubData = Array.from({ length: 48 }, () => null);
const stubDataWarning = (stubDataLength: number) => `Please increase stubData length "${stubDataLength}" to proceed!`;

describe("createBatch()", () => {
  describe("@returns", () => {
    describe.each([2, 4, 6])("with batches of %i", testBatchSize => {
      test.each([1, 2, 5, 8])("with batch size of %i", testBatchCount => {
        const stubMaxTestItems = testBatchSize * testBatchCount;

        const requiredStubDataLength = stubMaxTestItems - stubData.length;

        if (requiredStubDataLength > 0) {
          throw new Error(stubDataWarning(stubData.length + requiredStubDataLength));
        }

        const stubPayload = stubData.slice(0, stubMaxTestItems);
        const payload = createBatch(stubPayload, testBatchSize);

        expect(payload).toHaveLength(testBatchCount);

        payload.forEach(payloadBatch => {
          expect(payloadBatch).toHaveLength(testBatchSize);
        });
      });
    });
  });
});
