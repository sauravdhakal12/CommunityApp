/* ##############
  INPUT FORMS
################ */

export interface FormUserType {
  name: string,
  email: string,
  password: string,
};



/* ##############
  DATABSE
################ */

export interface DbUserType extends FormUserType {
  id: string,
  joinedOn: string,
  verified: boolean,
}