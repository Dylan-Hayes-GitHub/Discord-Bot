interface FissureNotFoundResponse {
  foundAnyFissures: false;
  noActiveEndlessFissure: string;
  noActiveEndlessFissureMessage: string;
}

interface FissureFoundResponse {
  foundAnyFissures: true;
  missionType: string;
  currentMissionTypes: string;
  planet: string;
  currentPlanetResources: string;
  timeLeft: string;
  currentTimesLeft: string;
  missionNode: string;
  nodeName: string;
  upComingFissures: string;
  nextFissureMessage: string;
  noActiveEndlessFissureMessage?: never; // Make the property optional or remove it
  noActiveEndlessFissure?: never; // Make the property optional or remove it
}

export type FissureResponse = FissureNotFoundResponse | FissureFoundResponse;
