
import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schemaBlog = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required().messages(customMessages),
    content: Joi.string().required().messages(customMessages),
    author: Joi.string().messages(customMessages),
    imageTitle: Joi.string().required().messages(customMessages),
    // created_at: Joi.date(),
    // updated_at: Joi.date(),
});
export default schemaBlog