interface FissureMessage {
  foundAnyFissures: boolean;
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
  noActiveEndlessFissureMessage: string;
  noActiveEndlessFissure: string;
}
export type FissureResponse = FissureMessage ;