export interface CrewAssignment {
  _id: string;
  name: string;
  crews: Crew[];
}

export interface Crew {
  name: string;
  cadetIds: string[];
}

export type CrewAssignmentWithoutId = Omit<CrewAssignment, "_id">;
