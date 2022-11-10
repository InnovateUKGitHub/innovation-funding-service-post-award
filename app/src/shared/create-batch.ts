/**
 *
 * @description Splits out the inbound payload into batches, it is purely separated out by an integer.
 */
export function createBatch<T>(payload: T[], batchSize: number): T[][] {
  const totalItems = payload.length;

  // Note: Honour the batchSize, bail out if don't need to filter
  if (totalItems <= batchSize) {
    return !totalItems ? [] : [payload];
  }

  const newPayload: typeof payload[] = [];
  let loopCount = 0;
  let batchIndex = 0;

  while (loopCount < totalItems) {
    const remainder = loopCount % batchSize;
    const hasStartedNewBatch = remainder === 0;

    if (loopCount !== 0 && hasStartedNewBatch) batchIndex++;

    // Note: Use batch or create empty new batch
    const batchToPopulate = (newPayload[batchIndex] ??= []);

    batchToPopulate.push(payload[loopCount]);

    loopCount++;
  }

  return newPayload;
}
