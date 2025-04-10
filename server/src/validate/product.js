import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required().min(3).max(255).messages(customMessages),
  description: Joi.string().min(3).messages(customMessages),
  images: Joi.array().messages(customMessages),
  isActive: Joi.boolean().messages(customMessages),
  categoryId: Joi.string().messages(customMessages),
  sizes: Joi.array().messages(customMessages)
});

export default schema;
