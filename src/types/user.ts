export type UserRole = "ADMIN" | "USER";
export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  lastLogin: Date;
  // In case we work on real example!
  //
  // isVerified?: {
  //   type: Boolean;
  //   default: false;
  // };
  // resetPasswordToken?: String;
  // resetPasswordExpiresAt?: Date;
  // verificationToken?: String;
  // verificationTokenExpiresAt?: Date;
}

export interface UserInput {
  username?: string;
  email: string;
  password: string;
}
