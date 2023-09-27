import { body } from "express-validator";
import CONSTANTS from "../constants/constants";
export const userRegistrationValidation = ()=>{
    return [
        body('first_name').notEmpty().withMessage(CONSTANTS.FNAME_REQUIRED),
        body('last_name').notEmpty().withMessage(CONSTANTS.LNAME_REQUIRED),
        body('email').notEmpty().withMessage(CONSTANTS.EMAIL_REQUIRED)
            .isEmail().withMessage(CONSTANTS.INVALID_EMAIL).normalizeEmail(),
        body('password').notEmpty().withMessage(CONSTANTS.PASSWORD_REQUIRED)
            .isLength({min:6}).withMessage(CONSTANTS.PASSWORD_LENGHT_VALIDATION),
        body('gender').notEmpty().withMessage(CONSTANTS.GENDER_REQUIRED)
            .custom(value=>{
                if(value !== 'male' && value !== 'female'){
                    return false
                } else {
                    return true
                }
            }).withMessage(CONSTANTS.GENDER_VALIDATION),
        body('user_type').notEmpty().withMessage(CONSTANTS.USER_TYPE_REQUIRED)
            .custom(value=>{
                if(value !== 'customer' && value !== 'seller'){
                    return false
                } else {
                    return true
                }
            }).withMessage(CONSTANTS.USER_TYPE_VALIDATION),
    ]
}

export const userLoginValidation = ()=>{
    return [
        body('email').notEmpty().withMessage(CONSTANTS.EMAIL_REQUIRED)
            .isEmail().withMessage(CONSTANTS.INVALID_EMAIL).normalizeEmail(),
        body('password').notEmpty().withMessage(CONSTANTS.PASSWORD_REQUIRED)
            .isLength({min:6}).withMessage(CONSTANTS.PASSWORD_LENGHT_VALIDATION),
    ]
}