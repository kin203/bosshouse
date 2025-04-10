import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schema = Joi.object({
  code: Joi.string().required().min(4).max(120).messages(customMessages),
  discountPercent: Joi.number().min(1).max(100).required().messages(customMessages),
  maxDiscount: Joi.number().min(1).max(10000000).required().messages(customMessages),
  expirationDate: Joi.array().required().messages(customMessages),
  maximum: Joi.number().required().messages(customMessages)
});

export default schema;
