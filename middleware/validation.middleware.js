import {body, validationResult, param, query} from "express-validator";

export const validate = (validations) => {
    return async (req, res, next) => {
        //run all validation
        await Promise.all(validations.map(validation.run(req)));

        const errors = validationResult(req);
        if(errors.isEmpty()) {
            return next();
        }

        const extractedError = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))

        throw new Error("Validation error");
    }
}