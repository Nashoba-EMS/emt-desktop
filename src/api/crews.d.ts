export interface CrewAssignment {
  _id: string;
  name: string;
}

export interface Crew {
  name: string;
  cadetIds: string[];
}

export type CrewAssignmentWithoutId = Omit<CrewAssignment, "_id">;
