// to validate user registration
import { userRegistrationSchema } from "./validationSchemas.js";
import ExpressError  from "./ExpressError.js";

export const validateUserRegistration = (req,res,next) => {
    const {error} = userRegistrationSchema.validate(req.body);
    if(error){
      throw new ExpressError(error.details[0].message, 400);
    }
    next();
  }