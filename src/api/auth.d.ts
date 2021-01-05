export interface User {
  _id: string;
  email: string;
  password: string;
  admin: boolean;
  name: string;
  birthdate: string;
  certified: boolean;
  availability: UserAvailability[];
}

export type UserWithoutPassword = Omit<User, "password">;

export interface UserAvailability {
  date: string;
}
