/* ##############
  INPUT FORMS
################ */

export interface RegisterFormUserType {
  name: string,
  email: string,
  password: string,
};

export interface LoginFormUserType {
  email: string,
  password: string,
};

export type UserCookieType = {
  id: string,
  name: string,
  email: string,
}

/* ##############
  DATABSE
################ */

export interface DbUserType extends RegisterFormUserType {
  id: string,
  joinedOn: string,
  verified: boolean,
}