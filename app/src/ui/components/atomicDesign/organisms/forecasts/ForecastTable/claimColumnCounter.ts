interface IClaimColumnCounterProps {
  numberOfClaims: number;
  currentClaimNumber: number | null | undefined;
}

export interface IClaimColumnCounter {
  numberOfClaimedColumns: number;
  currentClaimNumber: number | null;
  numberOfForecastColumns: number;
}

const getColumnData = ({ numberOfClaims, currentClaimNumber }: IClaimColumnCounterProps): IClaimColumnCounter => {
  if (currentClaimNumber === 0) {
    return {
      currentClaimNumber: null,
      numberOfClaimedColumns: 0,
      numberOfForecastColumns: numberOfClaims,
    };
  }

  if (currentClaimNumber === null || currentClaimNumber === undefined || currentClaimNumber > numberOfClaims) {
    return {
      currentClaimNumber: null,
      numberOfClaimedColumns: numberOfClaims,
      numberOfForecastColumns: 0,
    };
  }

  return {
    currentClaimNumber,
    numberOfClaimedColumns: currentClaimNumber - 1,
    numberOfForecastColumns: numberOfClaims - currentClaimNumber,
  };
};

export { getColumnData };
