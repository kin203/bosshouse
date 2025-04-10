import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schema = Joi.object({
  fullName: Joi.string().messages(customMessages),
  phoneNumber: Joi.number().required().messages(customMessages),
  email: Joi.string().email().required().min(5).max(30).messages(customMessages),
  content: Joi.string().required().min(5).max(2555).messages(customMessages),
});

export default schema;
