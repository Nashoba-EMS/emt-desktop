export interface User {
  _id: string;
  email: string;
  password: string;
  admin: boolean;
  name: string;
  birthdate: string;
  eligible: boolean;
  certified: boolean;
  availability: UserAvailability[];
}

export type UserWithoutId = Omit<User, "_id">;
export type UserWithoutPassword = Omit<User, "password">;
export type UserOptionalPassword = UserWithoutPassword & { password?: string };

export interface UserAvailability {
  date: string;
}
