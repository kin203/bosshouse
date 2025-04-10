import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schema = Joi.object({
  _id: Joi.string().messages(customMessages),
  name: Joi.string().required().min(3).max(255).messages(customMessages),
  slug: Joi.string().required().min(5).max(255).messages(customMessages),
});

export default schema;
