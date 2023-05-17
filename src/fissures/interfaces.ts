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

export interface UserInSquad {
  userId: string;
  userName: string;
}

export interface Squad {
  relic: string;
  mission: string;
  currentSquad: UserInSquad[];
  messageId: string;
  guestMembers: boolean;
  totalSquadMembers: number;
  duration: string;
  hostId: string;
  frames?: string;
  totalGuestMembers?: number;
}

export type FissureResponse = FissureMessage ;