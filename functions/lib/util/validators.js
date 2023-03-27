"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignUpData = exports.validateLoginData = void 0;
const isEmpty = (str) => {
    if (str.trim() === "")
        return true;
    else
        return false;
};
const validateLoginData = (user) => {
    let errors = {};
    if (isEmpty(user.email))
        errors.email = "Must not be empty";
    if (isEmpty(user.password))
        errors.password = "Must not be  empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
exports.validateLoginData = validateLoginData;
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx))
        return true;
    else
        return false;
};
const validateSignUpData = (user) => {
    let errors = {};
    if (isEmpty(user.email)) {
        errors.email = "Must not be empty";
    }
    else if (!isEmail(user.email)) {
        errors.email = "Must be valid email address";
    }
    if (isEmpty(user.password))
        errors.password = "Must not be empty";
    if (user.password !== user.confirmPassword)
        errors.confirmPassword = "Passowrds must be the same";
    if (isEmpty(user.username))
        errors.username = "Must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
exports.validateSignUpData = validateSignUpData;
//# sourceMappingURL=validators.js.map