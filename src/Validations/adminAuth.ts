import { body } from "express-validator";
import CONSTANTS from "../constants/constants";

export const adminLoginValidation = ()=>{
    return [
        body('email').notEmpty().withMessage(CONSTANTS.EMAIL_REQUIRED).isEmail().withMessage(CONSTANTS.INVALID_EMAIL).normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage(CONSTANTS.PASSWORD_REQUIRED)
            .isLength({min:6})
            .withMessage(CONSTANTS.PASSWORD_LENGHT_VALIDATION),
    ]
}

export const adminRegistrationValidation = ()=>{
    return [
        body('email').notEmpty().withMessage(CONSTANTS.EMAIL_REQUIRED).isEmail().withMessage(CONSTANTS.INVALID_EMAIL).normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage(CONSTANTS.PASSWORD_REQUIRED)
            .isLength({min:6})
            .withMessage(CONSTANTS.PASSWORD_LENGHT_VALIDATION),
        body('first_name').notEmpty().withMessage(CONSTANTS.FNAME_REQUIRED),
        body('last_name').notEmpty().withMessage(CONSTANTS.LNAME_REQUIRED),
    ]
}
