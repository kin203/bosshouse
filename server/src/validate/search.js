import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schema = Joi.object({
  keyword: Joi.string().required().max(120).messages(customMessages)
});

export default schema;
