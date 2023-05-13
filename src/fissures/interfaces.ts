interface FissureNotFoundResponse {
    foundAnyFissures: false;
    fieldOneName: string;
    fieldOneValue: string;
  }
  
 interface FissureFoundResponse {
    foundAnyFissures: true;
    fieldNameOne: string;
    fieldOneValue: string;
    fieldNameTwo: string;
    fieldTwoValue: string;
    fieldThreeName: string;
    fieldThreeValue: string;
    fieldFourName: string;
    fieldFourValue: string;
  }

export type FissureResponse = FissureNotFoundResponse | FissureFoundResponse;
