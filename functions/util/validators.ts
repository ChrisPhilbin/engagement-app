import { IError } from "../api/models/error-model";
import { IUser } from "../api/models/user-model";

const isEmpty = (str: string): boolean => {
  if (str.trim() === "") return true;
  else return false;
};

export const validateLoginData = (user: IUser): { errors: IError; valid: boolean } => {
  let errors: IError = {};
  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be  empty";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const isEmail = (email: string): boolean => {
  const emailRegEx: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

export const validateSignUpData = (user: IUser): { errors: IError; valid: boolean } => {
  let errors: IError = {};

  if (isEmpty(user.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(user.email)) {
    errors.email = "Must be valid email address";
  }

  if (isEmpty(user.password)) errors.password = "Must not be empty";
  if (user.password !== user.confirmPassword) errors.confirmPassword = "Passowrds must be the same";
  if (isEmpty(user.username)) errors.username = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
